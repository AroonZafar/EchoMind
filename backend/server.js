require('dotenv').config();

const express = require('express');
const pool = require('./src/db/database');
const memoryRepository = require('./src/repositories/memoryRepository');

const PORT = 8000;
const HOST = '127.0.0.1';
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/graph', async (req, res) => {
  try {
    const memories = await memoryRepository.listMemories();
    const nodes = memories.map((memory) => ({
      id: memory.id,
      type: memory.type,
      title: memory.title,
      content: memory.content,
      importance: memory.importance,
      status: memory.status,
      event_time: memory.event_time,
      due_time: memory.due_time
    }));

    return res.status(200).json({ nodes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load memory graph.' });
  }
});

app.post('/api/memory/search', async (req, res) => {
  const { query } = req.body || {};

  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'query is required and cannot be empty.' });
  }

  try {
    const results = await memoryRepository.searchMemories(query);
    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to search memories.' });
  }
});

app.post('/api/memory/forget', async (req, res) => {
  const { id } = req.body || {};

  if (typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({ error: 'id is required.' });
  }

  try {
    const memory = await memoryRepository.forgetMemory(id);

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found.' });
    }

    return res.status(200).json(memory);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to forget memory.' });
  }
});

app.use(express.static(__dirname));

app.listen(PORT, HOST, () => {
  console.log(`EchoMind server running at http://${HOST}:${PORT}`);
});
