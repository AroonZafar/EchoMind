# Plan Mode Architecture Rules (Non-Obvious Only)

- There is a deliberate **split between DB schema and UI**: the SQLite backend (`src/`) and the frontend (`app.js`) are completely decoupled — graph data is hardcoded in the UI and not yet wired to the DB
- Planned API surface is visible in the UI mock (`/api/session/utterance`, `/api/graph`, `/api/suggestions/pending`) but none are implemented — these are the intended future endpoints; the empty `api/` directory is their intended home
- `better-sqlite3` singleton pattern means the DB connection is module-level; any future server framework must not re-require `database.js` in a way that creates multiple connections
- `proactive_suggestions` table has `cooldown_until` field and a status lifecycle (`pending→shown→dismissed/accepted`) already designed — implement suggestion logic against this schema
- Memory lifecycle is `active → completed → outdated → forgotten` (soft states only, no hard deletion by design)
- `importance` is a normalized float `[0,1]` — future retrieval/ranking logic should treat this as a first-class signal
- Voice subsystem architecture: `tokenServer.js` (port 3001) proxies AssemblyAI token generation; `voiceAgent.js` and `audio-worklet.js` are empty stubs awaiting implementation
- Two separate servers must run concurrently for full functionality: static server (port 8000) + voice token server (port 3001); CORS in token server is hard-coded to 8000
- No test infrastructure exists; adding tests will require choosing and installing a test framework first
- `relations` table (source/target memory FKs + `relation_type`) is the intended schema for graph edges — currently unused; the UI graph uses hardcoded demo data instead
