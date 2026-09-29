<div align="center">

# 🧠 EchoMind

### A voice-first personal memory agent that actually remembers.

<p>
  <a href="https://echo-mind-trfi.vercel.app/"><strong>🚀 Live Demo</strong></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/Eman2123/EchoMind"><strong>💻 Source Code</strong></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/AI-Powered-8B5CF6?style=for-the-badge" alt="AI"/>
</p>

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&pause=1000&color=7C3AED&center=true&vCenter=true&width=700&lines=Talk+naturally.+EchoMind+remembers.;Turn+speech+into+structured+memory.;Connect+people%2C+tasks%2C+events%2C+and+facts.;Search+your+memory.+Forget+what+you+want." alt="Typing animation"/>

</div>

---

## ✨ What is EchoMind?

**EchoMind** is a voice-first personal memory agent that turns everyday speech into structured, connected memories.

Instead of asking users to manually write notes, EchoMind listens to natural conversation, extracts useful information, resolves time references, connects related entities, stores the resulting memory, and makes it searchable later.

> **Talk naturally. Let EchoMind structure the memory.**

---

## 🎯 The Problem

Important information gets buried inside conversations, meetings, voice notes, reminders, and casual thoughts.

Traditional note-taking requires users to stop what they are doing and manually organize everything.

EchoMind takes the opposite approach:

**Just talk. Let the system remember the context.**

---

## 🧠 How EchoMind Works

<div align="center">
<pre>
                    🎙️ USER SPEAKS
                           │
                           ▼
              ┌─────────────────────┐
              │  AssemblyAI Voice   │
              │       Agent         │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Raw Transcript    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   AI Extraction     │
              │                     │
              │ People • Tasks      │
              │ Events • Facts      │
              │ Relationships       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Time Resolution    │
              │ "tomorrow" → date   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    Memory Layer     │
              │ PostgreSQL + Neon   │
              └──────────┬──────────┘
                         │
                ┌────────┴────────┐
                ▼                 ▼
          🔎 Search          🕸️ Graph
                │                 │
                └────────┬────────┘
                         ▼
                  💡 Context
                         │
                         ▼
                  ⚡ Action
</pre>
</div>

---

## 🚀 Core Features

<table>
<tr>
<td width="50%">

### 🎙️ Voice-First
Speak naturally instead of filling out forms or writing notes.

### 🧠 AI Memory Extraction
Extract people, tasks, events, facts, and relationships from conversational text.

### 🕸️ Connected Memory Graph
Turn isolated memories into a connected graph of entities and relationships.

</td>
<td width="50%">

### ⏰ Relative Time
Understand phrases such as "tomorrow", "next Friday", and "today at 11 AM".

### 🔎 Memory Search
Search stored memories and retrieve relevant context.

### 🧹 Forget Flow
Select and forget stored memories when they are no longer wanted.

</td>
</tr>
</table>

---

## 💬 Example

A user can simply say:

> "I have a meeting with Maya tomorrow at 11 AM about the AI assignment."

EchoMind can conceptually transform this into:

<div align="center">
<pre>
Person
  Maya
    │
    ├──────► Meeting
    │          │
    │          ├──────► Tomorrow → Absolute Date/Time
    │          │
    │          └──────► AI Assignment
    │
    └──────► Relationship Context
</pre>
</div>

The system does not only save the sentence. It extracts **structured context and relationships** that can be retrieved later.

---

## 🧩 AI Memory Pipeline

### 01 — Transcription
AssemblyAI converts spoken input into a usable transcript.

### 02 — Structured Extraction
The transcript is processed through an LLM-based structured extraction flow.

### 03 — Entity Detection
The system identifies relevant entities such as:

- People
- Tasks
- Events
- Facts
- Conversations

### 04 — Relationship Detection
Entities are connected through relationships such as:

- <code>concerned_about</code>
- <code>check_in</code>
- <code>due_on</code>
- <code>mentioned_with</code>
- <code>about</code>

### 05 — Validation
Extracted names and graph entities are checked against the source transcript to reduce unsupported or hallucinated information.

### 06 — Time Resolution
Relative expressions such as "tomorrow" and "next Friday" are converted into absolute datetimes when possible.

### 07 — Persistence
Structured memories are stored through the memory service using PostgreSQL and Neon.

### 08 — Retrieval
Stored memories can be searched, visualized, forgotten, and used as context for proactive suggestions.

---

## 🏗️ Architecture

<div align="center">
<pre>
┌──────────────────────────────────────────────────────────────┐
│                         EchoMind                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  User → Voice Input → AssemblyAI → AI Extraction             │
│                                      │                       │
│                    ┌─────────────────┼────────────────┐      │
│                    ▼                 ▼                ▼      │
│                 People             Tasks            Events   │
│                    │                 │                │      │
│                    └─────────────────┼────────────────┘      │
│                                      ▼                       │
│                              Relationships                   │
│                                      │                       │
│                                      ▼                       │
│                              Memory Service                  │
│                                      │                       │
│                                      ▼                       │
│                              PostgreSQL / Neon               │
│                                      │                       │
│                         ┌────────────┴────────────┐          │
│                         ▼                         ▼          │
│                    Memory Search             Memory Graph   │
│                         │                         │          │
│                         └────────────┬────────────┘          │
│                                      ▼                       │
│                              Next.js Frontend                │
│                                      │                       │
│                                      ▼                       │
│                              User Context                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
</pre>
</div>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, TypeScript |
| Styling | Tailwind CSS |
| Graph | react-force-graph-2d |
| Icons | Lucide React |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Database Hosting | Neon |
| Voice | AssemblyAI |
| AI | LLM-based structured extraction |
| APIs | REST |
| Deployment | Vercel + FastAPI Cloud |

---

## 🌐 Live Services

<div align="center">

| Service | Status | Link |
|---|:---:|---|
| 🎨 Frontend | 🟢 Live | [Open EchoMind](https://echo-mind-trfi.vercel.app/) |
| 🧠 Memory Service | 🟢 Live | [Open Service](https://echo-mind-blush-seven.vercel.app/) |
| 🤖 AI Service | 🟢 Live | [Open Service](https://echomind.fastapicloud.dev/) |

</div>

---

## 📁 Project Structure

<pre>
EchoMind/
│
├── backend/
│   ├── src/
│   │   └── db/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── package.json
│
├── src/
│   └── voice / AI related source
│
├── schema.sql
├── .env.example
└── AGENTS.md
</pre>

---

## ⚡ Quick Start

### 1. Clone

<pre>
git clone https://github.com/Eman2123/EchoMind.git
cd EchoMind
</pre>

### 2. Backend

<pre>
cd backend
npm install
npm start
</pre>

Configure the required backend environment variables before starting the service.

### 3. Frontend

Open another terminal:

<pre>
cd frontend
npm install
npm run dev
</pre>

Then open <code>http://localhost:3000</code>.

For local voice functionality, configure the required values in your local <code>.env.local</code> based on the provided environment examples.

---

## 🧪 Development Checks

Before sharing frontend changes:

<pre>
cd frontend
npm run typecheck
npm run build
</pre>

---

## 🔐 Privacy & Memory Control

Memory should remain under the user's control.

EchoMind provides flows for:

- Viewing remembered context
- Searching memories
- Selecting a memory
- Forgetting a selected memory
- Keeping memory interactions explicit

The goal is to make persistent context useful without making it uncontrollable.

---

## 🎬 Demo Flow

<div align="center">
<pre>
🎙️ Speak
   ↓
📝 Transcript
   ↓
🧠 AI understands the context
   ↓
🔗 Entities + relationships extracted
   ↓
💾 Memory stored
   ↓
🕸️ Graph updated
   ↓
🔎 Memory becomes searchable
   ↓
💡 Relevant context can surface later
</pre>
</div>

---

## 🔮 Roadmap

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
- [ ] More granular memory permissions
- [ ] Expanded graph relationship types
- [ ] Personal memory analytics

---

## 👥 Team

<div align="center">

| Contributor |
|---|
| **Eman Mirza** |
| **Aroonzz** |
| **Felix** |
| **Rabeesa** |

</div>

---

## ⭐ Why EchoMind?

Most productivity tools ask:

> **"What do you want to write down?"**

EchoMind asks:

> **"What did you say that might matter later?"**

That is the idea behind EchoMind: turning conversations into **persistent, connected, searchable context**.

---

<div align="center">

## 🧠 EchoMind

### Your conversations shouldn't disappear.

<a href="https://echo-mind-trfi.vercel.app/">
<img src="https://img.shields.io/badge/🚀_TRY_ECHOMIND-LIVE_DEMO-111827?style=for-the-badge" alt="Try EchoMind"/>
</a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" alt="Footer animation"/>

</div>
