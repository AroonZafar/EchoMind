<div align="center">

# 🧠 EchoMind

### AI-Powered Voice Memory Agent

**Speak naturally. EchoMind listens, understands, connects, and remembers.**

<p>
  <a href="https://echo-mind-trfi.vercel.app/">Live Demo</a> •
  <a href="https://github.com/Eman2123/EchoMind">Repository</a>
</p>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![AssemblyAI](https://img.shields.io/badge/AssemblyAI-FF4F00?style=for-the-badge)

</div>

---

## ✨ What is EchoMind?

EchoMind is a **voice-first personal memory agent** that transforms everyday conversations into structured, connected memories.

Instead of opening a notes app and manually writing down everything important, you simply **talk**. EchoMind converts speech into a transcript, uses AI to understand the important information, resolves time expressions, stores the resulting memory, and connects related people, tasks, events, and facts.

> **Make remembering feel as natural as talking.**

### Why EchoMind?

Traditional notes are mostly flat text:

~~~text
Meeting with Maya tomorrow
~~~

EchoMind turns the same statement into structured context:

~~~text
Maya → Meeting → AI Assignment → Thursday → 11 AM
~~~

That structure makes the information easier to **search, visualize, update, forget, and reuse later**.

---

## 🎙️ From Voice to Memory

<div align="center">

**Speak** → **Transcribe** → **Understand** → **Extract** → **Connect** → **Store** → **Retrieve**

</div>

~~~text
┌──────────────┐
│ User speaks  │
└──────┬───────┘
       ↓
┌────────────────────┐
│ AssemblyAI Voice   │
│ Agent / Transcript │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ AI Memory          │
│ Extraction         │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ People • Tasks     │
│ Events • Facts     │
│ Time • Relations   │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Memory Service     │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Neon PostgreSQL    │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Search • Graph     │
│ Forget • Context   │
└────────────────────┘
~~~

---

## 🚀 Core Features

| Feature | What it does |
|---|---|
| 🎙️ **Voice Interaction** | Capture natural conversations through AssemblyAI |
| 🧠 **AI Memory Extraction** | Convert transcripts into structured memories |
| 👤 **Entity Detection** | Identify people, tasks, events, facts, and context |
| 🔗 **Relationship Graph** | Connect related memories visually |
| 🕐 **Relative Time Resolution** | Convert “tomorrow” and “next Friday” into real dates |
| 🔎 **Memory Search** | Retrieve previously stored context |
| 🗑️ **Forget Memory** | Remove memories and keep the graph synchronized |
| 💾 **Persistent Storage** | Store structured memory in PostgreSQL / Neon |
| 🔁 **Retry + Fallback** | Retry failed extraction and preserve raw transcripts |
| ⚡ **Proactive Context** | Prepare stored information for future reminders and actions |

---

## 🏗️ System Architecture

~~~mermaid
flowchart TB
    U[User] --> V[Next.js Voice UI]
    V --> A[AssemblyAI]
    A --> T[Live Transcript]
    T --> AI[AI Extraction Service]

    AI --> P[People]
    AI --> TK[Tasks]
    AI --> E[Events]
    AI --> F[Facts]
    AI --> R[Relationships]
    AI --> D[Relative Time]

    P --> M[Memory Service]
    TK --> M
    E --> M
    F --> M
    R --> M
    D --> M

    M --> DB[(Neon PostgreSQL)]

    DB --> S[Search API]
    DB --> G[Graph API]
    DB --> FR[Forget API]

    S --> FE[Next.js Frontend]
    G --> FE
    FR --> FE

    FE --> C[Relevant Context]
    C --> PR[Future Proactive Actions]
~~~

---

## 🔄 End-to-End Data Flow

~~~mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant A as AssemblyAI
    participant AI as AI Service
    participant M as Memory Service
    participant DB as Neon PostgreSQL

    U->>FE: Speak naturally
    FE->>A: Voice stream
    A-->>FE: Live transcript
    FE->>AI: Send transcript
    AI->>AI: Extract entities
    AI->>AI: Validate entities
    AI->>AI: Resolve relative time
    AI->>AI: Build relationships
    AI-->>FE: Structured memory
    FE->>M: Store memory
    M->>DB: Persist memory
    DB-->>M: Stored successfully
    M-->>FE: Updated context
    FE-->>U: Memory / graph updated
~~~

---

## 🧠 Memory Model

EchoMind does not simply save conversations as large blocks of text.

It transforms important information into a small knowledge structure:

~~~mermaid
graph TD
    C[Conversation]

    C --> P[Person: Maya]
    C --> E[Event: Meeting]
    C --> T[Task: AI Assignment]
    C --> D[Date: Thursday]
    C --> F[Fact / Context]

    E -->|with| P
    E -->|about| T
    E -->|scheduled_on| D
    C -->|provides_context| F
~~~

---

## 🤖 AI Memory Extraction

### Example

**User says:**

> “I have a meeting with Maya tomorrow at 11 AM about the AI assignment.”

### EchoMind extracts:

~~~text
Person
└── Maya

Event
└── Meeting

Task / Topic
└── AI Assignment

Time
└── Tomorrow at 11 AM

Relationship
└── Meeting → with → Maya
└── Meeting → about → AI Assignment
└── Meeting → scheduled_at → Absolute DateTime
~~~

### Relationship Graph

~~~mermaid
graph LR
    Maya[👤 Maya]
    Meeting[📅 Meeting]
    Task[📝 AI Assignment]
    Time[🕐 Absolute DateTime]

    Meeting -->|with| Maya
    Meeting -->|about| Task
    Meeting -->|scheduled_at| Time
~~~

---

## 🛡️ Reliability & Safety

AI extraction needs guardrails. EchoMind includes validation around the generated memory.

| Protection | Purpose |
|---|---|
| **Transcript Validation** | Check generated information against the original speech |
| **Name Validation** | Prevent unsupported names from becoming memory nodes |
| **Date Handling** | Normalize relative time into usable dates |
| **Retry Logic** | Retry extraction when an AI request fails |
| **Raw Transcript Fallback** | Preserve what the user actually said if structured extraction fails |
| **Graph Consistency** | Keep deleted memories out of the active graph |
| **Duplicate Awareness** | Reduce repeated or unnecessary memory entries |

### Relative Time Resolution

~~~text
"tomorrow"
      ↓
2026-09-30

"next Friday"
      ↓
Absolute calendar date

"today at 11 AM"
      ↓
Absolute date + time
~~~

---

## 🔍 Memory Search

~~~mermaid
flowchart LR
    Q[User Query] --> API[Search API]
    API --> DB[(Neon PostgreSQL)]
    DB --> R[Relevant Memories]
    R --> UI[Search Results]
    UI --> C[Recovered Context]
~~~

The search layer allows EchoMind to move from **remembering information** to **finding useful context when needed**.

---

## 🗑️ Forget Flow

Memory should remain under the user's control.

~~~mermaid
flowchart LR
    U[Select Memory] --> F[Forget Action]
    F --> API[Forget API]
    API --> DB[(PostgreSQL)]
    DB --> G[Update Memory State]
    G --> UI[Updated Graph / UI]
~~~

When a memory is forgotten, the application updates the active memory state and keeps the visual graph consistent.

---

## 📊 Project Architecture at a Glance

| Layer | Technology | Responsibility |
|---|---|---|
| **Frontend** | Next.js, React, TypeScript | Voice UI, memory UI, graph, search |
| **Voice** | AssemblyAI | Live speech-to-text / voice interaction |
| **AI Layer** | LLM-based extraction | Structured memory generation |
| **Memory API** | Node.js, Express | Storage, search, graph, forget APIs |
| **Database** | PostgreSQL, Neon | Persistent memory storage |
| **Graph** | react-force-graph-2d | Visual relationship exploration |
| **Deployment** | Vercel + FastAPI Cloud | Production services |

---

## 🧩 Project Structure

~~~text
EchoMind/
├── backend/              # Express memory service
├── frontend/             # Next.js application
├── src/                  # Voice / AI related source
├── schema.sql            # Database schema
├── .env.example          # Environment configuration
├── AGENTS.md             # Project guidance
└── README.md
~~~

---

## ⚙️ Quick Start

### 1. Clone

~~~bash
git clone https://github.com/Eman2123/EchoMind.git
cd EchoMind
~~~

### 2. Backend

~~~bash
cd backend
npm install
npm start
~~~

Configure the required environment variables before starting the backend.

### 3. Frontend

Open a second terminal:

~~~bash
cd frontend
npm install
npm run dev
~~~

Then open http://localhost:3000.

---

## 🌐 Live Services

| Service | Purpose | URL |
|---|---|---|
| **Frontend** | Next.js application | [Live App](https://echo-mind-trfi.vercel.app/) |
| **Memory Service** | Express memory + graph APIs | [Memory API](https://echo-mind-blush-seven.vercel.app/) |
| **AI Service** | AI extraction | [AI Service](https://echomind.fastapicloud.dev/) |

### Production Flow

~~~mermaid
flowchart LR
    U[User Browser]
    V[Vercel Frontend]
    AI[AI Service]
    M[Memory Service]
    DB[(Neon PostgreSQL)]

    U --> V
    V --> AI
    V --> M
    AI --> M
    M --> DB
    DB --> M
    M --> V
~~~

---

## 🧪 Development & Validation

Before pushing frontend changes:

~~~bash
cd frontend
npm run typecheck
npm run build
~~~

Backend:

~~~bash
cd backend
npm install
npm start
~~~

The extraction pipeline has also been validated with test utterances covering **updates, duplicate information, vague speech, relative dates, and extraction failures**.

---

## 🗺️ Complete Project Flow

~~~mermaid
flowchart TD
    A[User Speaks] --> B[AssemblyAI]
    B --> C[Transcript]
    C --> D[AI Extraction]

    D --> E{Valid?}
    E -->|Yes| F[Structured Memory]
    E -->|Retry| D
    E -->|Failed| R[Raw Transcript Fallback]

    F --> G[Resolve Time]
    G --> H[Create Relationships]
    H --> I[Memory Service]
    I --> J[(Neon PostgreSQL)]

    J --> K[Search]
    J --> L[Graph]
    J --> N[Forget]

    K --> M[Frontend]
    L --> M
    N --> M
    R --> M

    M --> O[Relevant Context]
    O --> P[Future Proactive Actions]
~~~

---

## 🛣️ Roadmap

- [x] Voice-first interaction
- [x] AI memory extraction
- [x] Structured memory entities
- [x] Relationship-based memory graph
- [x] Memory search
- [x] Relative date/time resolution
- [x] Memory forget flow
- [x] PostgreSQL persistence
- [x] Live deployment
- [ ] More advanced semantic retrieval
- [ ] Richer proactive reminders
- [ ] Granular memory permissions
- [ ] Expanded graph relationship types
- [ ] Personal memory analytics

---

## 👥 Team

- **Eman Mirza**
- **Aroonzz**
- **Felix**
- **Rabeesa**

---

## 🔗 Project Links

- **Repository:** [Eman2123/EchoMind](https://github.com/Eman2123/EchoMind)
- **Live Frontend:** [echo-mind-trfi.vercel.app](https://echo-mind-trfi.vercel.app/)
- **Memory Service:** [echo-mind-blush-seven.vercel.app](https://echo-mind-blush-seven.vercel.app/)
- **AI Service:** [echomind.fastapicloud.dev](https://echomind.fastapicloud.dev/)

---

<div align="center">

### 🧠 EchoMind

**Your conversations become memories. Your memories become context.**

</div>