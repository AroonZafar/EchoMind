"""Resolves free-text relative time phrases ("tomorrow", "next Friday",
"in 2 hours", "today at 11am") into absolute datetimes, so the proactive
trigger engine has a real, comparable timestamp instead of only a raw
phrase sitting in content.when / content.due.

Uses `dateparser` when available (handles a very wide range of natural
phrasing correctly, including weekday names, "in N hours/days", explicit
times). Falls back to a small hand-rolled parser covering the common
cases if dateparser isn't installed, so this never hard-fails the save
path -- worst case it just returns None and the raw phrase is all that's
kept, same as before.
"""
import re
from datetime import datetime, timedelta
from typing import Optional

try:
    import dateparser
    _HAS_DATEPARSER = True
except ImportError:
    _HAS_DATEPARSER = False

_WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def _preprocess(phrase: str) -> str:
    """dateparser resolves a bare weekday ("friday") correctly against
    RELATIVE_BASE + PREFER_DATES_FROM=future, but "next friday" / "this
    thursday" confusingly return None -- so strip those prefixes rather
    than lose the whole phrase. "tonight" alone is also unreliable, so
    normalize it to an explicit evening time dateparser understands."""
    low = phrase.strip().lower()
    if low == "tonight":
        return "today 19:00"
    if low.startswith("next "):
        return phrase.strip()[5:]
    if low.startswith("this "):
        return phrase.strip()[5:]
    return phrase.strip()


def resolve_relative_date(phrase: str, base_time: Optional[datetime] = None) -> Optional[datetime]:
    """Resolve `phrase` into an absolute datetime relative to `base_time`
    (defaults to now, UTC). Returns None if it can't be parsed -- callers
    should keep the raw phrase in content either way; this only supplies
    the extra comparable timestamp."""
    if not phrase or not str(phrase).strip():
        return None
    phrase = str(phrase).strip()
    base_time = base_time or datetime.utcnow()

    if _HAS_DATEPARSER:
        return dateparser.parse(
            _preprocess(phrase),
            settings={
                "RELATIVE_BASE": base_time,
                "PREFER_DATES_FROM": "future",
                "RETURN_AS_TIMEZONE_AWARE": False,
            },
        )

    # Fallback (no dateparser installed): cover the common cases by hand
    # rather than doing nothing.
    p = phrase.lower()

    m = re.search(r"in\s+(\d+)\s*hour", p)
    if m:
        return base_time + timedelta(hours=int(m.group(1)))
    m = re.search(r"in\s+(\d+)\s*day", p)
    if m:
        return base_time + timedelta(days=int(m.group(1)))

    if "tomorrow" in p:
        target = base_time + timedelta(days=1)
    elif "today" in p or "tonight" in p:
        target = base_time
    else:
        target = None
        for i, wd in enumerate(_WEEKDAYS):
            if wd in p:
                days_ahead = (i - base_time.weekday()) % 7
                days_ahead = days_ahead or 7  # saying "friday" on a friday means next friday
                target = base_time + timedelta(days=days_ahead)
                break
        if target is None:
            return None

    hour, minute = 9, 0  # default time-of-day when none is stated
    t = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)", p)
    if t:
        hour = int(t.group(1)) % 12
        minute = int(t.group(2) or 0)
        if t.group(3) == "pm":
            hour += 12
    elif "tonight" in p:
        hour = 19

    return target.replace(hour=hour, minute=minute, second=0, microsecond=0)