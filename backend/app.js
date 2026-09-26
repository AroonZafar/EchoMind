const fallbackGraphNodes = [
  { id: 'ali', type: 'person', label: 'Ali', x: 250, y: 70 },
  { id: 'assignment', type: 'event', label: 'AI Assignment', x: 330, y: 145 },
  { id: 'deadline', type: 'event', label: 'Friday', x: 210, y: 210 },
  { id: 'task', type: 'task', label: 'Check in', x: 90, y: 160 },
  { id: 'stress', type: 'fact', label: 'Stress', x: 135, y: 250 },
  { id: 'conversation', type: 'conversation', label: 'Conversation', x: 300, y: 250 },
  { id: 'meeting', type: 'event', label: 'Met Today', x: 70, y: 80 }
];

const fallbackGraphEdges = [
  { source: 'ali', target: 'assignment', label: 'concerned_about' },
  { source: 'ali', target: 'task', label: 'check_in' },
  { source: 'assignment', target: 'deadline', label: 'due_on' },
  { source: 'meeting', target: 'ali', label: 'mentioned_with' },
  { source: 'stress', target: 'assignment', label: 'about' },
  { source: 'conversation', target: 'ali', label: 'about' },
  { source: 'task', target: 'deadline', label: 'due_on' }
];

const graphTypes = {
  person: { className: 'node person', color: '#355e8b' },
  event: { className: 'node event', color: '#b58222' },
  task: { className: 'node task', color: '#2c8c6e' },
  fact: { className: 'node fact', color: '#b84c58' },
  conversation: { className: 'node conversation', color: '#7154b3' }
};

let graphNodes = fallbackGraphNodes;
let graphEdges = fallbackGraphEdges;
let selectedMemoryId = null;

function createSvgElement(name, attrs) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }
  return element;
}

function drawGraph() {
  const nodesGroup = document.getElementById('nodesGroup');
  const edgesGroup = document.getElementById('edgesGroup');

  nodesGroup.replaceChildren();
  edgesGroup.replaceChildren();

  graphEdges.forEach((edge) => {
    const source = graphNodes.find((node) => node.id === edge.source);
    const target = graphNodes.find((node) => node.id === edge.target);

    if (!source || !target) {
      return;
    }

    const line = createSvgElement('line', {
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      class: 'edge-line'
    });

    const edgeLabel = createSvgElement('text', {
      x: (source.x + target.x) / 2,
      y: (source.y + target.y) / 2 - 6,
      class: 'edge-text'
    });
    edgeLabel.textContent = edge.label;

    edgesGroup.appendChild(line);
    edgesGroup.appendChild(edgeLabel);
  });

  graphNodes.forEach((node) => {
    const type = graphTypes[node.type] || graphTypes.fact;
    const group = createSvgElement('g', {
      transform: `translate(${node.x}, ${node.y})`
    });

    const circle = createSvgElement('circle', {
      cx: 0,
      cy: 0,
      r: '28',
      class: type.className,
      filter: 'url(#shadow)'
    });

    const label = createSvgElement('text', {
      x: 0,
      y: 4,
      class: 'node-label'
    });
    label.textContent = node.label;

    group.appendChild(circle);
    group.appendChild(label);
    nodesGroup.appendChild(group);
  });
}

function appendTranscript(message, speaker) {
  const transcript = document.getElementById('transcriptList');
  const turn = document.createElement('div');
  turn.className = `turn ${speaker}`;

  const avatar = document.createElement('span');
  avatar.className = 'turn-avatar';
  avatar.textContent = speaker === 'user' ? 'You' : 'Echo';

  const bubble = document.createElement('div');
  bubble.className = 'turn-bubble';

  const text = document.createElement('span');
  text.className = 'turn-text';
  text.textContent = message;

  bubble.appendChild(text);
  turn.appendChild(avatar);
  turn.appendChild(bubble);

  transcript.appendChild(turn);
}

function updateGraph() {
  const graphCaption = document.querySelector('.panel-tag.info');
  graphCaption.textContent = `${graphNodes.length} nodes`;
}

function normalizeNodeType(type) {
  const normalizedType = String(type || '').toLowerCase();

  if (normalizedType.includes('person')) {
    return 'person';
  }
  if (normalizedType.includes('event')) {
    return 'event';
  }
  if (normalizedType.includes('task')) {
    return 'task';
  }
  if (normalizedType.includes('conversation') || normalizedType.includes('note')) {
    return 'conversation';
  }
  return 'fact';
}

function mapApiNodes(nodes) {
  return nodes.map((node, index) => ({
    id: String(node.id),
    type: normalizeNodeType(node.type),
    label: node.title || node.label || 'Untitled memory',
    x: 70 + (index % 4) * 95,
    y: 75 + Math.floor(index / 4) * 105
  }));
}

async function loadGraph() {
  const graphCaption = document.querySelector('.panel-tag.info');

  try {
    const response = await fetch('/api/graph');
    if (!response.ok) {
      throw new Error(`Graph request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.nodes)) {
      throw new Error('Graph response did not contain nodes');
    }

    graphNodes = mapApiNodes(data.nodes);
    graphEdges = [];
    renderMemoryResults(data.nodes);
    drawGraph();
    updateGraph();
  } catch (error) {
    graphNodes = fallbackGraphNodes;
    graphEdges = fallbackGraphEdges;
    graphCaption.textContent = 'Demo graph (API unavailable)';
    drawGraph();
  }
}

function processUtterance() {
  const input = document.getElementById('utteranceInput');
  const message = input.value.trim();

  if (!message) {
    return;
  }

  appendTranscript(message, 'user');
  appendTranscript('Memory saved: Ali, AI assignment, and Friday deadline connected.', 'agent');

  const memoryList = document.getElementById('memoryList');
  const newMemory = document.createElement('div');
  newMemory.className = 'memory-item';
  newMemory.innerHTML = `
    <span class='memory-type fact'>Fact</span>
    <span class='memory-label'>${message.slice(0, 40)}</span>
    <span class='memory-meta'>new memory</span>
  `;
  memoryList.appendChild(newMemory);

  updateGraph();
}

function memoryTypeClass(type) {
  return normalizeNodeType(type);
}

function memoryMeta(memory) {
  if (memory.status) {
    return memory.status;
  }
  if (memory.content && typeof memory.content === 'object') {
    return memory.content.text || 'memory result';
  }
  return memory.content || 'memory result';
}

function renderMemoryResults(results) {
  const memoryList = document.getElementById('memoryList');
  memoryList.replaceChildren();
  selectedMemoryId = null;

  results.forEach((memory) => {
    const item = document.createElement('div');
    item.className = 'memory-item';
    item.dataset.memoryId = memory.id || '';

    const type = document.createElement('span');
    type.className = `memory-type ${memoryTypeClass(memory.type)}`;
    type.textContent = memory.type || 'Fact';

    const label = document.createElement('span');
    label.className = 'memory-label';
    label.textContent = memory.title || 'Untitled memory';

    const meta = document.createElement('span');
    meta.className = 'memory-meta';
    meta.textContent = memoryMeta(memory);

    item.append(type, label, meta);
    memoryList.appendChild(item);
  });
}

async function searchMemories() {
  const input = document.getElementById('memorySearchInput');
  const status = document.getElementById('memorySearchStatus');
  const query = input.value.trim();

  if (!query) {
    status.textContent = 'Enter a search term.';
    return;
  }

  status.textContent = 'Searching...';

  try {
    const response = await fetch('/api/memory/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Search failed with status ${response.status}`);
    }
    if (!Array.isArray(data.results)) {
      throw new Error('Search response did not contain results');
    }

    renderMemoryResults(data.results);
    status.textContent = `${data.results.length} result${data.results.length === 1 ? '' : 's'} found.`;
  } catch (error) {
    status.textContent = 'Search unavailable. Please try again.';
  }
}

async function forgetSelectedMemory() {
  const responseMessage = document.getElementById('privacyResponse');

  if (!selectedMemoryId) {
    responseMessage.textContent = 'Select a memory before forgetting it.';
    return;
  }

  const memoryId = selectedMemoryId;
  responseMessage.textContent = 'Forgetting memory...';

  try {
    const response = await fetch('/api/memory/forget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: memoryId })
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Memory not found. Refresh the memory list and try again.');
      }
      if (response.status === 400) {
        throw new Error('A valid memory must be selected.');
      }
      if (response.status >= 500) {
        throw new Error('Memory service unavailable. Please try again.');
      }
      throw new Error(data.error || 'Unable to forget memory.');
    }

    const memoryItem = [...document.querySelectorAll('#memoryList .memory-item')]
      .find((item) => item.dataset.memoryId === memoryId);
    memoryItem?.remove();
    graphNodes = graphNodes.filter((node) => node.id !== memoryId);
    graphEdges = graphEdges.filter((edge) => edge.source !== memoryId && edge.target !== memoryId);
    selectedMemoryId = null;
    drawGraph();
    updateGraph();
    responseMessage.textContent = `${data.title || 'Memory'} forgotten.`;
  } catch (error) {
    responseMessage.textContent = error.message === 'Failed to fetch'
      ? 'Memory service unavailable. Please try again.'
      : error.message;
  }
}

function statementForAction() {
  const suggestions = document.getElementById('suggestionMessage');
  suggestions.textContent = 'Ali’s assignment deadline is today. Would you like to check in with him?';
}

document.getElementById('processButton').addEventListener('click', processUtterance);
document.getElementById('memorySearchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  searchMemories();
});
document.getElementById('dismissSuggestion').addEventListener('click', () => {
  const message = document.getElementById('suggestionMessage');
  message.textContent = 'Suggestion dismissed. EchoMind remains ready for future context.';
});
document.getElementById('acceptSuggestion').addEventListener('click', () => {
  const message = document.getElementById('suggestionMessage');
  message.textContent = 'Reminder created: Check in with Ali.';
});
document.getElementById('whatRememberButton').addEventListener('click', () => {
  const response = document.getElementById('privacyResponse');
  response.textContent = 'EchoMind remembers Ali, the AI assignment, Friday deadline, and the conversation context.';
});
document.getElementById('forgetButton').addEventListener('click', forgetSelectedMemory);
document.getElementById('memoryList').addEventListener('click', (event) => {
  const item = event.target.closest('.memory-item');
  if (!item?.dataset.memoryId) {
    return;
  }

  selectedMemoryId = item.dataset.memoryId;
  const label = item.querySelector('.memory-label')?.textContent || 'memory';
  document.getElementById('privacyResponse').textContent = `Selected memory: ${label}.`;
});

document.getElementById('refreshButton').addEventListener('click', () => {
  const message = document.getElementById('transcriptList');
  appendTranscript('What do you remember about Ali?', 'user');
  appendTranscript('I remember Ali and his assignment deadline. The relationship is active.', 'agent');
  message.scrollTop = message.scrollHeight;
});

loadGraph();
