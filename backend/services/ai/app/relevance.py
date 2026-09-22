import os
import json
import re
import httpx
from datetime import datetime
from app import store

TRIGGER_THRESHOLD = 0.65

_TIME_KEYWORDS_TODAY = {"today", "tonight", "this evening", "this morning", "this afternoon"}
_TIME_KEYWORDS_SOON = {"tomorrow", "friday", "monday", "tuesday", "wednesday", "thursday", "saturday", "sunday", "this week"}

AIML_API_KEY = os.getenv("AIML_API_KEY")
AIML_API_URL = os.getenv("AIML_API_URL", "https://api.aimlapi.com/v1/chat/completions")

_PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")
with open(os.path.join(_PROMPTS_DIR, "suggestion_prompt.md"), "r", encoding="utf-8") as f:
    SUGGESTION_PROMPT_TEMPLATE = f.read()


def _tokenize(text: str):
    return set(re.findall(r"[a-zA-Z0-9']+", (text or "").lower()))


def _content_to_text(content) -> str:
    """memory['content'] comes back from psycopg2 as a dict (JSONB is
    auto-deserialized), not a string -- never string-concatenate it
    directly. Flatten it into plain text for tokenizing/keyword checks."""
    if not content:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, dict):
        return " ".join(str(v) for v in content.values() if v)
    return str(content)


def _context_match(memory: dict, context_text: str) -> float:
    if not context_text:
        return 0.5  # neutral default when no live context is given
    mem_text = memory["title"] + " " + _content_to_text(memory.get("content"))
    mem_tokens = _tokenize(mem_text)
    ctx_tokens = _tokenize(context_text)
    if not mem_tokens or not ctx_tokens:
        return 0.0
    overlap = mem_tokens & ctx_tokens
    return round(len(overlap) / len(mem_tokens | ctx_tokens), 3)


def _time_relevance(memory: dict) -> float:
    resolved = memory.get("due_time") or memory.get("event_time")
    if resolved:
        # psycopg2 returns TIMESTAMP columns as real datetime objects
        # already; only fall back to parsing if something upstream ever
        # hands this back as a string (e.g. a JSON-serialized API response).
        if isinstance(resolved, str):
            try:
                resolved = datetime.fromisoformat(resolved)
            except ValueError:
                resolved = None
        if resolved:
            delta_hours = (resolved - datetime.utcnow()).total_seconds() / 3600
            if delta_hours <= 24:
                return 1.0   # overdue, or due/happening within the next day
            if delta_hours <= 72:
                return 0.6   # within the next few days
            return 0.3       # further out -- still known, just not urgent yet

    # No resolved timestamp (date_resolver couldn't parse the phrase, or
    # there was no time phrase at all) -- fall back to the keyword
    # heuristic so scoring still degrades gracefully instead of going to 0.
    text = (memory["title"] + " " + _content_to_text(memory.get("content"))).lower()
    if any(k in text for k in _TIME_KEYWORDS_TODAY):
        return 1.0
    if any(k in text for k in _TIME_KEYWORDS_SOON):
        return 0.6
    return 0.3


def _importance(memory: dict) -> float:
    imp = memory.get("importance", 0.5)
    # our extractor stores importance 0-10ish sometimes; normalize defensively
    if imp > 1:
        imp = imp / 10.0
    return max(0.0, min(1.0, imp))


def _unresolved(memory: dict) -> float:
    return 1.0 if memory.get("status") == "active" else 0.0


def _recent_repeat_penalty(memory: dict, force: bool = False) -> float:
    """Penalize a memory that's still within its cooldown window -- but
    only while it's actually still in cooldown, not forever after the
    first time it was ever suggested. (Previously this checked "was
    there ever any suggestion row" rather than "is one still active",
    so the very first successful suggestion permanently dragged the
    score down by 0.10 on every future check, even after the 60-minute
    cooldown had long expired.) force=True (testing/demo) clears it
    entirely, matching the cooldown-skip behavior above."""
    if force:
        return 0.0
    return 1.0 if store.is_in_cooldown(memory["id"]) else 0.0


def compute_relevance(memory: dict, context_text: str = "", force: bool = False) -> dict:
    # Scoring formula stays deterministic on purpose (fast, and immune to
    # the LLM being slow/down) -- only the suggestion's spoken phrasing
    # below is LLM-generated. See doc §35: don't over-engineer the
    # trigger logic itself.
    context_match = _context_match(memory, context_text)
    time_relevance = _time_relevance(memory)
    importance = _importance(memory)
    unresolved = _unresolved(memory)
    recent_repeat = _recent_repeat_penalty(memory, force=force)

    score = (
        0.30 * context_match
        + 0.25 * time_relevance
        + 0.20 * importance
        + 0.15 * unresolved
        - 0.10 * recent_repeat
    )
    return {
        "memory_id": memory["id"],
        "title": memory["title"],
        "score": round(score, 3),
        "components": {
            "context_match": context_match,
            "time_relevance": time_relevance,
            "importance": importance,
            "unresolved": unresolved,
            "recent_repeat": recent_repeat,
        },
    }


def _build_suggestion_message(memory: dict) -> str:
    """Short templated suggestion. This is the fallback used whenever the
    LLM-generated phrasing (below) fails or times out, so the demo never
    breaks just because the AI API is slow/unavailable."""
    title = memory["title"]
    mtype = memory.get("type", "fact")
    if mtype == "task":
        return f"You still have '{title}' pending. Want a reminder?"
    if mtype == "event":
        return f"'{title}' is coming up. Want to check in?"
    if mtype == "person":
        return f"You mentioned {title} recently. Want to follow up?"
    return f"You might want to revisit: '{title}'."


async def _generate_llm_suggestion_message(memory: dict, reason: str) -> str:
    """LLM-phrased version of the suggestion (doc §14: suggestion
    generation call). Falls back to the deterministic template on any
    failure -- missing API key, timeout, bad response shape, etc. -- so a
    slow/unavailable AI API degrades gracefully instead of breaking the
    proactive-suggestion flow."""
    if not AIML_API_KEY:
        return _build_suggestion_message(memory)

    prompt = SUGGESTION_PROMPT_TEMPLATE.format(
        mem_type=memory.get("type", "fact"),
        title=memory["title"],
        details=_content_to_text(memory.get("content")) or "(no extra details)",
        reason=reason,
    )
    headers = {
        "Authorization": f"Bearer {AIML_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.4,
        "max_tokens": 60,
    }

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            response = await client.post(AIML_API_URL, json=payload, headers=headers)
            data = response.json()
        if response.status_code != 200 or "choices" not in data:
            return _build_suggestion_message(memory)
        text = data["choices"][0]["message"]["content"].strip().strip('"')
        return text if text else _build_suggestion_message(memory)
    except Exception:
        return _build_suggestion_message(memory)


async def check_relevance(context_text: str = "", force: bool = False):
    """
    Scans all active memories, scores them against the given context,
    and returns suggestions for anything that crosses the threshold and
    is not in cooldown. Also records the suggestion (sets cooldown).

    force=True skips the cooldown check -- useful while testing/demoing,
    so re-running the same query doesn't silently return an empty list
    just because the same memory was already suggested within the last
    60 minutes. Normal (non-demo) callers should leave this False.
    """
    memories = [m for m in store.list_memories() if m.get("status") == "active"]
    triggered = []

    for memory in memories:
        if not force and store.is_in_cooldown(memory["id"]):
            continue
        scored = compute_relevance(memory, context_text, force=force)
        if scored["score"] >= TRIGGER_THRESHOLD:
            reason = (
                f"score={scored['score']} "
                f"(context={scored['components']['context_match']}, "
                f"time={scored['components']['time_relevance']}, "
                f"importance={scored['components']['importance']})"
            )
            message = await _generate_llm_suggestion_message(memory, reason)
            record = store.record_suggestion(memory["id"], message, reason)
            triggered.append({**scored, "message": message, "reason": reason, "suggestion_id": record["id"]})

    return triggered