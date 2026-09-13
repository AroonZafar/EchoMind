"""
Deterministic relevance engine.

Per doc section 8 (Agent Tools and Behavior):
    score = 0.30 * context_match
          + 0.25 * time_relevance
          + 0.20 * importance
          + 0.15 * unresolved
          - 0.10 * recent_repeat
    Trigger only when score >= 0.65 and cooldown has expired.

These weights are prototype starting values, not validated research results.
"""
import re
from app import store

TRIGGER_THRESHOLD = 0.65

_TIME_KEYWORDS_TODAY = {"today", "tonight", "this evening", "this morning", "this afternoon"}
_TIME_KEYWORDS_SOON = {"tomorrow", "friday", "monday", "tuesday", "wednesday", "thursday", "saturday", "sunday", "this week"}


def _tokenize(text: str):
    return set(re.findall(r"[a-zA-Z0-9']+", (text or "").lower()))


def _context_match(memory: dict, context_text: str) -> float:
    if not context_text:
        return 0.5  # neutral default when no live context is given
    mem_text = memory["title"] + " " + (memory.get("content") or "")
    mem_tokens = _tokenize(mem_text)
    ctx_tokens = _tokenize(context_text)
    if not mem_tokens or not ctx_tokens:
        return 0.0
    overlap = mem_tokens & ctx_tokens
    return round(len(overlap) / len(mem_tokens | ctx_tokens), 3)


def _time_relevance(memory: dict) -> float:
    text = (memory["title"] + " " + (memory.get("content") or "")).lower()
    if memory.get("due_time") or memory.get("event_time"):
        return 0.8  # has an explicit time set (future improvement: parse and compare to now)
    if any(k in text for k in _TIME_KEYWORDS_TODAY):
        return 1.0
    if any(k in text for k in _TIME_KEYWORDS_SOON):
        return 0.6
    return 0.3


def _importance(memory: dict) -> float:
    imp = memory.get("importance", 0.5)
    if imp > 1:
        imp = imp / 10.0
    return max(0.0, min(1.0, imp))


def _unresolved(memory: dict) -> float:
    return 1.0 if memory.get("status") == "active" else 0.0


def _recent_repeat_penalty(memory: dict) -> float:
    last = store.get_last_suggestion(memory["id"])
    return 1.0 if last else 0.0


def compute_relevance(memory: dict, context_text: str = "") -> dict:
    context_match = _context_match(memory, context_text)
    time_relevance = _time_relevance(memory)
    importance = _importance(memory)
    unresolved = _unresolved(memory)
    recent_repeat = _recent_repeat_penalty(memory)

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
    """Short templated suggestion. Kept deterministic (no LLM call) so the
    demo never breaks if the AI API is slow/unavailable."""
    title = memory["title"]
    mtype = memory.get("type", "fact")
    if mtype == "task":
        return f"You still have '{title}' pending. Want a reminder?"
    if mtype == "event":
        return f"'{title}' is coming up. Want to check in?"
    if mtype == "person":
        return f"You mentioned {title} recently. Want to follow up?"
    return f"You might want to revisit: '{title}'."


def check_relevance(context_text: str = ""):
    """
    Scans all active memories, scores them against the given context,
    and returns suggestions for anything that crosses the threshold and
    is not in cooldown. Also records the suggestion (sets cooldown).
    """
    memories = [m for m in store.list_memories() if m.get("status") == "active"]
    triggered = []

    for memory in memories:
        if store.is_in_cooldown(memory["id"]):
            continue
        scored = compute_relevance(memory, context_text)
        if scored["score"] >= TRIGGER_THRESHOLD:
            message = _build_suggestion_message(memory)
            reason = (
                f"score={scored['score']} "
                f"(context={scored['components']['context_match']}, "
                f"time={scored['components']['time_relevance']}, "
                f"importance={scored['components']['importance']})"
            )
            record = store.record_suggestion(memory["id"], message, reason)
            triggered.append({**scored, "message": message, "reason": reason, "suggestion_id": record["id"]})

    return triggered