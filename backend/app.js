const graphNodes = [
  { id: 'ali', type: 'person', label: 'Ali', x: 250, y: 70 },
  { id: 'assignment', type: 'event', label: 'AI Assignment', x: 330, y: 145 },
  { id: 'deadline', type: 'event', label: 'Friday', x: 210, y: 210 },
  { id: 'task', type: 'task', label: 'Check in', x: 90, y: 160 },
  { id: 'stress', type: 'fact', label: 'Stress', x: 135, y: 250 },
  { id: 'conversation', type: 'conversation', label: 'Conversation', x: 300, y: 250 },
  { id: 'meeting', type: 'event', label: 'Met Today', x: 70, y: 80 }
];

const graphEdges = [
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

  graphEdges.forEach((edge) => {
    const source = graphNodes.find((node) => node.id === edge.source);
    const target = graphNodes.find((node) => node.id === edge.target);
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
    const type = graphTypes[node.type];
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

function statementForAction() {
  const suggestions = document.getElementById('suggestionMessage');
  suggestions.textContent = 'Ali’s assignment deadline is today. Would you like to check in with him?';
}

document.getElementById('processButton').addEventListener('click', processUtterance);
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
document.getElementById('forgetButton').addEventListener('click', () => {
  const response = document.getElementById('privacyResponse');
  response.textContent = 'Memory forgotten. EchoMind will not use that memory in normal retrieval.';
});

document.getElementById('refreshButton').addEventListener('click', () => {
  const message = document.getElementById('transcriptList');
  appendTranscript('What do you remember about Ali?', 'user');
  appendTranscript('I remember Ali and his assignment deadline. The relationship is active.', 'agent');
  message.scrollTop = message.scrollHeight;
});

drawGraph();
