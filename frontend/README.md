# EchoMind frontend

Next.js 16, TypeScript, Tailwind CSS, and `react-force-graph-2d`.

```bash
cd frontend
npm install
npm run dev
```

Run `npm run typecheck` and `npm run build` before sharing changes. Next.js was upgraded from the original version 14 target after `npm audit fix --force`; the production build passes with version 16 on Windows.

Open http://localhost:3000. The microphone uses the browser Web Speech API when available. Use **Preview with a sample conversation** to see the mock transcript and suggestion without microphone access. The graph and suggestion are local demo data; no backend calls are made yet.
