-- EchoMind — Shared Memory Schema (source: backend/services/ai/app/store.py)
-- Both the AI service (Python) and Memory Layer (Node) should use this exact
-- schema so the two can eventually point at the same database without conflicts.

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- needed for gen_random_uuid()

CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,               -- 'Person' | 'Event' | 'Task' | 'Fact/Preference' | 'Conversation/Note'
    title TEXT NOT NULL,
    content JSONB,
    importance FLOAT NOT NULL DEFAULT 0.5,
    status TEXT NOT NULL DEFAULT 'active',   -- 'active' | 'completed' | 'outdated' | 'forgotten'
    event_time TIMESTAMP,
    due_time TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    target_memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proactive_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'shown' | 'dismissed' | 'accepted'
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    cooldown_until TIMESTAMP,
    UNIQUE(memory_id, status)
);

CREATE INDEX IF NOT EXISTS idx_memories_status ON memories(status);
CREATE INDEX IF NOT EXISTS idx_memories_title ON memories(LOWER(title));
CREATE INDEX IF NOT EXISTS idx_relations_source ON relations(source_memory_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_memory ON proactive_suggestions(memory_id);

-- Notes for Rabeesa migrating database.js / memoryRepository.js off SQLite:
-- 1. IDs are UUID here, not TEXT — use `uuid` package (Node) or DB-generated
--    gen_random_uuid() instead of manually generated string IDs.
-- 2. `content` is JSONB here (structured), not a plain TEXT column.
-- 3. Use `pg` or `postgres` npm package instead of `better-sqlite3`.
-- 4. Table/column names are otherwise the same as your original SQLite schema.
