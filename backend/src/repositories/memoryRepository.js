const db = require('../db/database');

function rowToMemory(row) {
  return row;
}

async function createMemory(data) {
  if (!data || !data.title || !String(data.title).trim()) {
    throw new Error('title is required and cannot be empty.');
  }

  if (data.content === undefined || data.content === null) {
    throw new Error('content is required and cannot be empty.');
  }

  const title = String(data.title).trim();
  const content =
    typeof data.content === 'object'
      ? data.content
      : { text: String(data.content).trim() };

  const values = [
    data.type || 'Fact',
    title,
    content,
    typeof data.importance === 'number' ? data.importance : 0.5,
    data.status || 'active',
    data.event_time || null,
    data.due_time || null
  ];

  const sql = `
    INSERT INTO memories (
      type, title, content, importance, status,
      event_time, due_time
    )
    VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7)
    RETURNING *
  `;

  const result = await db.query(sql, values);
  return rowToMemory(result.rows[0]);
}

async function getMemoryById(id) {
  const result = await db.query(
    'SELECT * FROM memories WHERE id = $1',
    [id]
  );

  return result.rows[0] ? rowToMemory(result.rows[0]) : null;
}

async function listMemories({ status = null, type = null } = {}) {
  let sql = 'SELECT * FROM memories WHERE 1 = 1';
  const params = [];

  if (status) {
    params.push(status);
    sql += ` AND status = $${params.length}`;
  }

  if (type) {
    params.push(type);
    sql += ` AND type = $${params.length}`;
  }

  sql += ' ORDER BY created_at DESC';

  const result = await db.query(sql, params);
  return result.rows.map(rowToMemory);
}

async function searchMemories(query = '') {
  const trimmedQuery = String(query || '').trim();

  if (!trimmedQuery) {
    return [];
  }

  const search = `%${trimmedQuery}%`;

  const sql = `
    SELECT *
    FROM memories
    WHERE status != 'forgotten'
      AND (
        title ILIKE $1
        OR content::text ILIKE $1
        OR type ILIKE $1
      )
    ORDER BY created_at DESC
  `;

  const result = await db.query(sql, [search]);
  return result.rows.map(rowToMemory);
}

async function updateMemory(id, updates) {
  const existing = await getMemoryById(id);

  if (!existing) {
    return null;
  }

  const next = {
    ...existing,
    ...updates
  };

  const content =
    typeof next.content === 'object'
      ? next.content
      : { text: String(next.content ?? '').trim() };

  const sql = `
    UPDATE memories
       SET type = $1,
           title = $2,
           content = $3::jsonb,
           importance = $4,
           status = $5,
           event_time = $6,
           due_time = $7,
           updated_at = NOW()
     WHERE id = $8
     RETURNING *
  `;

  const values = [
    next.type,
    String(next.title).trim(),
    content,
    next.importance,
    next.status,
    next.event_time || null,
    next.due_time || null,
    id
  ];

  const result = await db.query(sql, values);
  return result.rows[0] ? rowToMemory(result.rows[0]) : null;
}

async function forgetMemory(id) {
  const existing = await getMemoryById(id);

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
