# Ask Mode Context (Non-Obvious Only)

- The "API Contracts" panel in the UI (`index.html` lower-right) shows hardcoded mock endpoints — those routes do NOT exist in `server.js`
- `server.js` is a pure static file server only; there is no REST API implemented yet
- `app.js` graph data (`graphNodes`, `graphEdges`) is demo/hardcoded — NOT fetched from the SQLite database
- `app.js` `processUtterance()` returns a hardcoded agent reply ("Memory saved: Ali, AI assignment…") — it does not call any backend
- The `proactive_suggestions` table exists in the DB schema but has no backend logic wired up
- `forgetMemory` is soft-delete (sets status); there is no hard-delete anywhere in the codebase
- Design tokens (colors, spacing) live in CSS custom properties at the top of `styles.css` — not in a separate tokens file
- `src/voice/voiceAgent.js` and `src/voice/audio-worklet.js` exist but are completely empty — voice integration is not yet implemented
- The voice token server (`src/voice/tokenServer.js`) runs on port 3001 separately from the static server (port 8000); both must be running for voice to work
- `api/` directory exists at the project root but contains no files — it is a placeholder for future REST routes
