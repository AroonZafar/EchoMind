const crypto = require('crypto');
const db = require('../db/database');

function rowToMemory(row) {
  return row;
}

function createMemory(data) {
  if (!data || !data.title || !String(data.title).trim()) {
    throw new Error('title is required and cannot be empty.');
  }

  if (!data || !data.content || !String(data.content).trim()) {
    throw new Error('content is required and cannot be empty.');
  }

  const now = new Date().toISOString();
  const memory = {
    id: data.id || crypto.randomUUID(),
    type: data.type || 'Fact',
    title: String(data.title).trim(),
    content: String(data.content).trim(),
    importance: typeof data.importance === 'number' ? data.importance : 0,
    status: data.status || 'active',
    event_time: data.event_time || null,
    due_time: data.due_time || null,
    created_at: now,
    updated_at: now
  };

  const sql = `
    INSERT INTO memories (
      id, type, title, content, importance, status,
      event_time, due_time, created_at, updated_at
    ) VALUES (
      @id, @type, @title, @content, @importance, @status,
      @event_time, @due_time, @created_at, @updated_at
    )
  `;

  db.prepare(sql).run(memory);
  return getMemoryById(memory.id);
}

function getMemoryById(id) {
  const sql = `SELECT * FROM memories WHERE id = ?`;
  const row = db.prepare(sql).get(id);
  return row ? rowToMemory(row) : null;
}

function listMemories({ status = null, type = null } = {}) {
  let sql = 'SELECT * FROM memories WHERE 1 = 1';
  const params = [];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }

  sql += ' ORDER BY created_at DESC';

  const rows = db.prepare(sql).all(...params);
  return rows.map(rowToMemory);
}

function searchMemories(query = '') {
  const trimmedQuery = String(query || '').trim();

  if (!trimmedQuery) {
    return [];
  }

  const q = `%${trimmedQuery}%`;
  const sql = `
    SELECT * FROM memories
    WHERE status != 'forgotten'
      AND (
        title LIKE ?
        OR content LIKE ?
        OR type LIKE ?
      )
    ORDER BY created_at DESC
  `;

  const rows = db.prepare(sql).all(q, q, q);
  return rows.map(rowToMemory);
}

function updateMemory(id, updates) {
  const existing = getMemoryById(id);
  if (!existing) {
    return null;
  }

  const next = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString()
  };

  const sql = `
    UPDATE memories
       SET type = @type,
           title = @title,
           content = @content,
           importance = @importance,
           status = @status,
           event_time = @event_time,
           due_time = @due_time,
           updated_at = @updated_at
     WHERE id = @id
  `;

  db.prepare(sql).run(next);
  return getMemoryById(id);
}

function forgetMemory(id) {
  const existing = getMemoryById(id);
  if (!existing) {
    return null;
  }

  return updateMemory(id, { status: 'forgotten' });
}

module.exports = {
  createMemory,
  getMemoryById,
  listMemories,
  searchMemories,
  updateMemory,
  forgetMemory
};
