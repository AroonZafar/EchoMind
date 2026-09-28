# EchoMind frontend

Next.js 16, TypeScript, Tailwind CSS, and `react-force-graph-2d`.

```bash
cd frontend
npm install
npm run typecheck
npm run dev
```

Run `npm run typecheck` and `npm run build` before sharing changes. Next.js was upgraded from the original version 14 target after `npm audit fix --force`; the production build passes with version 16 on Windows.

Copy `.env.example` to `.env.local` and add an AssemblyAI API key before starting the app. Open http://localhost:3000. The microphone uses the AssemblyAI Voice Agent through the server-only `/api/voice-token` route. The graph and suggestion remain local demo data until the memory API integration step.
