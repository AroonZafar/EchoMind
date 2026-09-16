# Agent Coding Rules (Non-Obvious Only)

- All DB queries must use `db.prepare(sql).run/get/all` — never `db.exec` for parameterized queries (exec is schema-only)
- Use `@namedParam` bindings for multi-param INSERT/UPDATE; positional `?` for filters in SELECT
- New repository functions must follow the read-then-return pattern: mutating methods call `getMemoryById` to return the final row
- Do NOT add `async/await` or Promises to DB/repository code — `better-sqlite3` is fully synchronous by design. Exception: `src/voice/tokenServer.js` already uses async for the AssemblyAI fetch call
- New memory types must be added to the `CHECK(type IN (...))` constraint in `src/db/init.js` AND to `graphTypes` in `app.js`
- The `data/` directory must never be committed (it's runtime-created); add any new runtime dirs to `.gitignore`
- The static server in `server.js` serves files relative to `__dirname`; any new assets must live in the project root or subdirs
- `index.html` has a duplicate `</body></html>` at lines 245-247 — leave it as-is unless explicitly asked to fix it
- `crypto` is a Node built-in; never add an npm package for UUID generation
- `api/` directory exists but is empty — it is the intended future home for REST route handlers; do not put routes in `server.js`
- Token server CORS origin is hard-coded to `http://localhost:8000` in `src/voice/tokenServer.js` — update it if the dev port changes
- `ASSEMBLYAI_API_KEY` must be set in `.env` for the voice token server; `dotenv` is already a dependency
- `src/voice/voiceAgent.js` and `src/voice/audio-worklet.js` are empty stubs — do not assume they contain logic
