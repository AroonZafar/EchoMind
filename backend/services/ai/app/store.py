import os
import json
import uuid
from datetime import datetime, timedelta
from typing import Optional, List, Dict
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/echomind_dev")
SUGGESTION_COOLDOWN_MINUTES = 60


def get_conn():
    """Get PostgreSQL connection"""
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False
    return conn


def init_db():
    """Initialize database schema"""
    conn = get_conn()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS memories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            content JSONB,
            importance FLOAT NOT NULL DEFAULT 0.5,
            status TEXT NOT NULL DEFAULT 'active',
            event_time TIMESTAMP,
            due_time TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS relations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            source_memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
            target_memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
            relation_type TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS proactive_suggestions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
            message TEXT NOT NULL,
            reason TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            cooldown_until TIMESTAMP,
            UNIQUE(memory_id, status)
        );
        """)
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_memories_status ON memories(status);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_memories_title ON memories(LOWER(title));")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_relations_source ON relations(source_memory_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_suggestions_memory ON proactive_suggestions(memory_id);")
        
        conn.commit()
        print("✅ Database initialized successfully!")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error initializing database: {e}")
    finally:
        cursor.close()
        conn.close()


def find_memory_by_title(title: str, mem_type: Optional[str] = None) -> Optional[Dict]:
    """Case-insensitive lookup for duplicate detection"""
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if mem_type:
            cursor.execute(
                "SELECT * FROM memories WHERE LOWER(title) = LOWER(%s) AND LOWER(type) = LOWER(%s) AND status != 'forgotten' LIMIT 1",
                (title, mem_type)
            )
        else:
            cursor.execute(
                "SELECT * FROM memories WHERE LOWER(title) = LOWER(%s) AND status != 'forgotten' LIMIT 1",
                (title,)
            )
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        cursor.close()
        conn.close()


def upsert_memory(mem_type: str, title: str, content: dict, importance: float = 0.5,
                   event_time=None, due_time=None) -> Dict:
    """Create or update memory (no duplicates).

    event_time/due_time are optional resolved absolute datetimes (see
    app/date_resolver.py) -- the proactive relevance engine needs an
    actual comparable timestamp, not just the raw phrase sitting in
    content.when/content.due. COALESCE on update so a later mention that
    doesn't include a time phrase doesn't blow away a previously-resolved
    one."""
    existing = find_memory_by_title(title, mem_type)
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if existing:
            # Merge content
            merged_content = {**existing.get("content", {}), **content}
            cursor.execute(
                """UPDATE memories
                   SET content = %s,
                       importance = GREATEST(importance, %s),
                       event_time = COALESCE(%s, event_time),
                       due_time = COALESCE(%s, due_time),
                       updated_at = NOW()
                   WHERE id = %s RETURNING *""",
                (json.dumps(merged_content), importance, event_time, due_time, existing["id"])
            )
            row = cursor.fetchone()
            conn.commit()
            result = dict(row)
            result["was_update"] = True
            return result
        else:
            # Create new
            cursor.execute(
                """INSERT INTO memories (type, title, content, importance, status, event_time, due_time)
                   VALUES (%s, %s, %s, %s, 'active', %s, %s) RETURNING *""",
                (mem_type, title, json.dumps(content), importance, event_time, due_time)
            )
            row = cursor.fetchone()
            conn.commit()
            result = dict(row)
            result["was_update"] = False
            return result
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def add_relation(source_memory_id: str, target_memory_id: str, relation_type: str) -> str:
    """Add relation between memories (no duplicates)"""
    conn = get_conn()
    cursor = conn.cursor()
    
    try:
        # Check if exists
        cursor.execute(
            "SELECT id FROM relations WHERE source_memory_id = %s AND target_memory_id = %s AND relation_type = %s LIMIT 1",
            (source_memory_id, target_memory_id, relation_type)
        )
        existing = cursor.fetchone()
        
        if existing:
            return str(existing[0])
        
        # Create new
        rel_id = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO relations (id, source_memory_id, target_memory_id, relation_type) VALUES (%s, %s, %s, %s)",
            (rel_id, source_memory_id, target_memory_id, relation_type)
        )
        conn.commit()
        return rel_id
    finally:
        cursor.close()
        conn.close()


def list_memories(include_forgotten: bool = False) -> List[Dict]:
    """List all memories"""
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if include_forgotten:
            cursor.execute("SELECT * FROM memories ORDER BY updated_at DESC")
        else:
            cursor.execute("SELECT * FROM memories WHERE status != 'forgotten' ORDER BY updated_at DESC")
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        cursor.close()
        conn.close()


def list_relations() -> List[Dict]:
    """List all relations"""
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute("SELECT * FROM relations")
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        cursor.close()
        conn.close()


def forget_memory(title: Optional[str] = None, memory_id: Optional[str] = None) -> bool:
    """Mark memory as forgotten"""
    conn = get_conn()
    cursor = conn.cursor()
    
    try:
        if memory_id:
            cursor.execute("UPDATE memories SET status = 'forgotten', updated_at = NOW() WHERE id = %s", (memory_id,))
        elif title:
            cursor.execute("UPDATE memories SET status = 'forgotten', updated_at = NOW() WHERE LOWER(title) = LOWER(%s)", (title,))
        else:
            return False
        
        conn.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        conn.close()


def mark_completed(title: Optional[str] = None, memory_id: Optional[str] = None) -> bool:
    """Mark memory as completed"""
    conn = get_conn()
    cursor = conn.cursor()
    
    try:
        if memory_id:
            cursor.execute("UPDATE memories SET status = 'completed', updated_at = NOW() WHERE id = %s", (memory_id,))
        elif title:
            cursor.execute("UPDATE memories SET status = 'completed', updated_at = NOW() WHERE LOWER(title) = LOWER(%s)", (title,))
        else:
            return False
        
        conn.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        conn.close()


def get_last_suggestion(memory_id: str) -> Optional[Dict]:
    """Get last suggestion for a memory"""
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            "SELECT * FROM proactive_suggestions WHERE memory_id = %s ORDER BY created_at DESC LIMIT 1",
            (memory_id,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        cursor.close()
        conn.close()


def is_in_cooldown(memory_id: str) -> bool:
    """Check if memory is in suggestion cooldown"""
    last = get_last_suggestion(memory_id)
    if not last or not last.get("cooldown_until"):
        return False
    
    try:
        cooldown_time = last["cooldown_until"]
        if isinstance(cooldown_time, str):
            cooldown_time = datetime.fromisoformat(cooldown_time)
        return datetime.utcnow() < cooldown_time
    except Exception:
        return False


def record_suggestion(memory_id: str, message: str, reason: str) -> Dict:
    """Record a proactive suggestion. Upserts on (memory_id, status) --
    the table has a UNIQUE constraint on that pair, so once a memory has
    been suggested once (status='shown'), a plain INSERT for the same
    memory would violate that constraint every time after. ON CONFLICT
    refreshes the existing 'shown' row (new message/reason/cooldown)
    instead of erroring."""
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cooldown_until = datetime.utcnow() + timedelta(minutes=SUGGESTION_COOLDOWN_MINUTES)

        cursor.execute(
            """
            INSERT INTO proactive_suggestions (memory_id, message, reason, status, cooldown_until)
            VALUES (%s, %s, %s, 'shown', %s)
            ON CONFLICT (memory_id, status) DO UPDATE
            SET message = EXCLUDED.message,
                reason = EXCLUDED.reason,
                cooldown_until = EXCLUDED.cooldown_until,
                created_at = NOW()
            RETURNING *
            """,
            (memory_id, message, reason, cooldown_until)
        )
        row = cursor.fetchone()
        conn.commit()
        return dict(row) if row else {}
    finally:
        cursor.close()
        conn.close()


def update_suggestion_status(suggestion_id: str, status: str) -> bool:
    """Update suggestion status"""
    conn = get_conn()
    cursor = conn.cursor()
    
    try:
        cursor.execute("UPDATE proactive_suggestions SET status = %s WHERE id = %s", (status, suggestion_id))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        conn.close()