# EchoMind frontend

Next.js 16, TypeScript, Tailwind CSS, and `react-force-graph-2d`.

```bash
cd frontend
npm install
npm run typecheck
npm run dev
```

Run `npm run typecheck` and `npm run build` before sharing changes. Next.js was upgraded from the original version 14 target after `npm audit fix --force`; the production build passes with version 16 on Windows.

Copy `.env.example` to `.env.local` and add an AssemblyAI API key before starting the app. Start the Node memory API on port 8000 and the Python AI service on port 8001, then open http://localhost:3000. The microphone uses the AssemblyAI Voice Agent through the server-only `/api/voice-token` route. Final user transcripts are sent to the AI service's `/api/remember` endpoint; the graph loads from the Node API's `/api/graph` endpoint. Set `MEMORY_API_URL` and `AI_SERVICE_URL` in `.env.local` if those services use other addresses. Suggestions are not connected yet.
