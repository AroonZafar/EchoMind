# EchoMind AI Service (Person B — AI/LLM)

FastAPI service that handles memory extraction, relevance scoring, and
proactive suggestions for EchoMind. Built on the AI/ML API (aimlapi.com)
and Neon PostgreSQL.

**Live:** https://echomind.fastapicloud.dev
**Interactive API docs (Swagger UI):** https://echomind.fastapicloud.dev/docs

## Structure

```
backend/services/ai/
├── main.py              # FastAPI app entrypoint
├── requirements.txt
├── .env.example
├── app/
│   ├── models.py         # Pydantic request/response models
│   ├── extractors.py     # Utterance → structured memory (AIML API)
│   ├── relevance.py      # Deterministic relevance scoring
│   ├── routes.py         # API routes
│   └── store.py          # Postgres (Neon) persistence layer
└── tests/
    └── test_utterances.py
```

## Setup

```bash
cd backend/services/ai
py -3.12 -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # then fill in real values
```

## Environment variables

| Variable | Description |
|---|---|
| `AIML_API_KEY` | API key from aimlapi.com |
| `DATABASE_URL` | Neon Postgres connection string |
| `AI_PORT` | Port to run on locally (default 8001) |

## Run locally

```bash
uvicorn main:app --reload --port 8001
```

Health check: `GET http://localhost:8001/api/health`

## API endpoints

All routes are prefixed with `/api`. Base URL locally is
`http://localhost:8001`, in production `https://echomind.fastapicloud.dev`.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/extract-memory` | Extract structured memory from a raw utterance (no storage) |
| POST | `/api/remember` | Extract + save a memory in one call |
| GET | `/api/memories` | List stored memories |
| POST | `/api/check-relevance` | Score a memory's current relevance |
| POST | `/api/suggestions/confirm` | Mark a suggestion as accepted |
| POST | `/api/suggestions/dismiss` | Mark a suggestion as dismissed |
| POST | `/api/forget` | Soft-delete a memory |
| POST | `/api/complete` | Mark a task/event memory as completed |
| GET | `/api/health` | Health check |

Try any of these directly in the browser via the [Swagger UI](https://echomind.fastapicloud.dev/docs) — no auth required.

## Tests

```bash
python -m pytest tests/test_utterances.py
```

## Deployment

Deployed via [FastAPI Cloud](https://fastapicloud.com):

```bash
fastapi cloud login
fastapi cloud apps create --link
fastapi cloud env set AIML_API_KEY
fastapi cloud env set DATABASE_URL
fastapi deploy
```

Notes:
- Pin Python to 3.12 (`.python-version` file, UTF-8 encoded) — some
  dependencies (`psycopg2-binary`) don't yet have prebuilt wheels for 3.14.
- Use `fastapi[standard]` (not bare `fastapi`) in `requirements.txt`, or the
  `fastapi` CLI won't be installed in the deployed container.
- Use `psycopg2-binary>=2.9.9` (a range, not an exact pin) so `uv` can pick
  a version with a valid prebuilt wheel.
- `pyproject.toml` needs both of these to deploy cleanly:
  ```toml
  [tool.fastapi]
  entrypoint = "main:app"

  [tool.uv]
  package = false
  ```

## Notes for the team

- This service uses its own Neon Postgres project. Schema is shared via
  `schema.sql` (same table structure, UUID ids) with the Node memory
  layer (`backend/src/`), but the two currently point at separate
  databases unless explicitly configured otherwise.
- Suggestion messages are template-based, not LLM-generated, for demo
  reliability.
