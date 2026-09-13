const fs = require('fs');
const path = require('path');
const db = require('./database');

const dataDir = path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const schema = `
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('Person', 'Event', 'Task', 'Fact', 'Preference', 'Conversation', 'Note')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  importance REAL NOT NULL DEFAULT 0 CHECK(importance >= 0 AND importance <= 1),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'outdated', 'forgotten')),
  event_time TEXT,
  due_time TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS relations (
  id TEXT PRIMARY KEY,
  source_memory_id TEXT NOT NULL,
  target_memory_id TEXT NOT NULL,
  relation_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(source_memory_id) REFERENCES memories(id) ON DELETE CASCADE,
  FOREIGN KEY(target_memory_id) REFERENCES memories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proactive_suggestions (
  id TEXT PRIMARY KEY,
  memory_id TEXT NOT NULL,
  message TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'shown', 'dismissed', 'accepted')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cooldown_until TEXT,
  FOREIGN KEY(memory_id) REFERENCES memories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
CREATE INDEX IF NOT EXISTS idx_memories_status ON memories(status);
CREATE INDEX IF NOT EXISTS idx_memories_event_time ON memories(event_time);
CREATE INDEX IF NOT EXISTS idx_memories_due_time ON memories(due_time);
CREATE INDEX IF NOT EXISTS idx_memories_importance ON memories(importance);
CREATE INDEX IF NOT EXISTS idx_relations_source ON relations(source_memory_id);
CREATE INDEX IF NOT EXISTS idx_relations_target ON relations(target_memory_id);
CREATE INDEX IF NOT EXISTS idx_relations_type ON relations(relation_type);
CREATE INDEX IF NOT EXISTS idx_proactive_suggestions_memory ON proactive_suggestions(memory_id);
CREATE INDEX IF NOT EXISTS idx_proactive_suggestions_status ON proactive_suggestions(status);
`;

db.exec(schema);

console.log(`EchoMind SQLite database initialized at ${db.name}`);
