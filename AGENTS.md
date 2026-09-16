# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack
- **Backend**: Node.js (CommonJS, `"type": "commonjs"`), `better-sqlite3` — no framework, no TypeScript
- **Frontend**: Vanilla JS + SVG (`app.js`), served by a hand-rolled static file server (`server.js`)
- **Database**: SQLite at `data/echomind.sqlite` (auto-created; never committed)
- **Voice**: AssemblyAI integration (`src/voice/`) — requires `ASSEMBLYAI_API_KEY` in `.env`

## Commands
| Task | Command |
|------|---------|
| Initialize DB schema | `node src/db/init.js` (or `npm run db:init`) |
| Run static server | `node server.js` → http://127.0.0.1:8000 |
| Run voice token server | `node src/voice/tokenServer.js` → http://localhost:3001 |

> There are **no tests, no linter, no build step** in the project currently.

## Architecture
```
index.html + styles.css + app.js   ← static UI (graph rendered via SVG DOM manipulation)
        ↕  (served by)
server.js                          ← plain http.createServer static file server, port 8000
src/db/database.js                 ← singleton better-sqlite3 connection (WAL + FK on)
src/db/init.js                     ← creates tables/indexes via db.exec(schema)
src/repositories/memoryRepository.js ← all DB access; use db.prepare().run/get/all only
src/voice/tokenServer.js           ← separate HTTP server (port 3001) for AssemblyAI tokens
src/voice/voiceAgent.js            ← empty stub; voice agent logic not yet implemented
src/voice/audio-worklet.js         ← empty stub; audio processing not yet implemented
```

## Critical Patterns

- **All DB access must go through `src/repositories/memoryRepository.js`** — `src/db/database.js` exports a singleton; do not `require` it directly from UI or server code.
- **`better-sqlite3` is synchronous** — no `async/await`, no promises, no callbacks for DB calls.
- **`tokenServer.js` uses `async/await`** — it calls the AssemblyAI REST API over `fetch`; this is the one exception to the sync rule (it is not a DB file).
- **Memory IDs** are generated with `crypto.randomUUID()` (Node built-in, no package needed).
- **`forgetMemory`** sets `status = 'forgotten'`; it does NOT delete rows. `searchMemories` excludes `forgotten` records automatically.
- **`"forget"` is soft-delete only** — there is no hard-delete function in the repository.
- **`data/` directory** is created at runtime by `database.js`; do not create it manually or commit it.
- **`index.html` has a duplicate `</body></html>`** (lines 245–247) — a known issue; do not add another.
- **Graph data** (`graphNodes`, `graphEdges`) in `app.js` is hardcoded static demo data, not wired to the SQLite backend yet.
- **`server.js` is static-files only** — there is no REST API; the UI's "API Contracts" panel shows mock endpoints that don't exist yet.
- **`api/` directory exists but is empty** — it is the intended future location for REST route handlers.
- **Token server CORS** is hard-coded to `http://localhost:8000` — it will reject requests from any other origin.

## Memory Schema
```
memories.type  ∈ { 'Person','Event','Task','Fact','Preference','Conversation','Note' }
memories.status ∈ { 'active','completed','outdated','forgotten' }
memories.importance  — REAL [0,1]
proactive_suggestions.status ∈ { 'pending','shown','dismissed','accepted' }
proactive_suggestions.cooldown_until — TEXT (ISO timestamp), used for rate-limiting suggestions
```

## Code Style
- `require` for all imports (CommonJS); no `import`/`export`
- Named exports via `module.exports = { fn1, fn2 }` (object pattern)
- SQL uses `@param` named bindings for INSERT/UPDATE and positional `?` for SELECT filters
- `camelCase` for JS identifiers; `snake_case` for all DB column names
- No error handling framework — throw `new Error('message')` for validation, return `null` for not-found
