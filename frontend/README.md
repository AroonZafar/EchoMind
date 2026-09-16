# EchoMind frontend

Next.js 16, TypeScript, Tailwind CSS, and `react-force-graph-2d`.

```bash
cd frontend
npm install
npm run dev
```

Run `npm run typecheck` and `npm run build` before sharing changes. Next.js was upgraded from the original version 14 target after `npm audit fix --force`; the production build passes with version 16 on Windows.

Open http://localhost:3000. The microphone uses the AssemblyAI Voice Agent through the local token proxy at `/api/voice-token`. The graph and suggestion remain local demo data until the memory API integration step.
