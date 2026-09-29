# EchoMind

> **Talk. It remembers.**

EchoMind is a voice-first personal memory agent that turns everyday speech into structured, connected memories and helps surface relevant context when it matters.

## Live Demo

- **Frontend:** https://echo-mind-trfi.vercel.app/
- **Memory Service:** https://echo-mind-blush-seven.vercel.app/
- **AI Service:** https://echomind.fastapicloud.dev/

## What EchoMind Does

EchoMind is designed around the idea that personal information should not disappear after a conversation. It captures spoken context, extracts useful memories, connects related information, and makes that context searchable and actionable.

### Core capabilities

- Voice-first interaction with AssemblyAI
- AI-powered memory extraction
- Structured memories for people, tasks, events, and facts
- Connected memory graph with relationships
- Memory search
- Relative-time resolution such as "tomorrow" and "next Friday"
- Proactive context and reminder suggestions
- Memory deletion / forget flow for user control
- Persistent storage with PostgreSQL and Neon
- Next.js frontend with a graph-based memory view
- Express memory backend

## Architecture

```text
User Voice
    │
    ▼
AssemblyAI Voice Agent
    │
    ▼
AI Extraction Service
    │
    ├── People
    ├── Tasks
    ├── Events
    └── Relationships
    │
    ▼
Memory Service
    │
    ▼
PostgreSQL / Neon
    │
    ▼
Memory Graph + Search + Proactive Context
    │
    ▼
Next.js Frontend
```

## Tech Stack

### Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- react-force-graph-2d
- Lucide React

### Backend
- Node.js
- Express
- PostgreSQL
- Neon
- REST APIs

### AI & Voice
- AssemblyAI Voice Agent
- LLM-based structured memory extraction
- Relative date/time resolution
- AI memory and relationship processing

## Project Structure

```text
EchoMind/
├── backend/       # Express memory service and database logic
├── frontend/      # Next.js application
├── src/           # Voice-related source
├── schema.sql     # Database schema
├── .env.example   # Root environment example
└── AGENTS.md      # Project guidance
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Eman2123/EchoMind.git
cd EchoMind
```

### 2. Backend

```bash
cd backend
npm install
npm start
```

Configure the required environment variables before starting the backend.

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

For local voice functionality, configure the variables in `frontend/.env.example` in your local `.env.local`.

## Development Checks

Before sharing frontend changes:

```bash
cd frontend
npm run typecheck
npm run build
```

## Privacy & Control

EchoMind includes explicit memory-management flows so users can inspect remembered information and forget selected memories. The system is designed to make memory useful without removing user control over stored context.

## Team

Built by the EchoMind team:

- **Eman Mirza**
- **Aroonzz**
- **FelixDoIT (CoderEpPiTi)**
- **Rabeesa**

## License

This project is currently provided as a hackathon project. Add a project-specific license before distributing it as open-source software.
