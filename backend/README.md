# GymTracker API

A production-style REST API for tracking gym workouts built with FastAPI + PostgreSQL.

## Tech Stack
- **FastAPI** — async Python web framework
- **SQLAlchemy 2.0** (async) — ORM
- **PostgreSQL** — database (via Docker)
- **Alembic** — migrations
- **JWT** (python-jose) — authentication
- **Pydantic v2** — validation
- **slowapi** — rate limiting

## Setup

1. Clone the repo
```bash
   git clone <repo_url>
   cd gym-tracker/backend
```

2. Create and activate virtual environment
```bash
   python -m venv venv
   venv\Scripts\activate       # Windows
```

3. Install dependencies
```bash
   pip install -r requirements.txt
```

4. Configure environment
```bash
   cp .env.example .env
   # Edit .env with your DB credentials and secret key
```

5. Start PostgreSQL (Docker)
```bash
   docker start gymtracker-db
```

6. Run migrations
```bash
   alembic upgrade head
```

7. Start the server
```bash
   python run.py
```

8. Visit `http://localhost:8000/docs` for Swagger UI

## API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/auth/refresh` | Token | Refresh access token |
| GET | `/user/profile` | Yes | Get current user |
| GET | `/exercises` | No | List all exercises |
| POST | `/exercises` | Yes | Add exercise |
| GET | `/workouts` | Yes | List workouts (paginated, filtered) |
| GET | `/workouts/{id}` | Yes | Get single workout |
| POST | `/workouts` | Yes | Create workout |
| PUT | `/workouts/{id}` | Yes | Update workout |
| DELETE | `/workouts/{id}` | Yes | Delete workout |
| GET | `/stats/summary` | Yes | Workout stats summary |
| GET | `/stats/personal_bests` | Yes | Max weight per exercise |

## Query Params (GET /workouts)
- `page` — page number (default 1)
- `limit` — results per page (default 10, max 50)
- `type` — filter by workout type e.g. Strength
- `date_from` — filter from date e.g. 2026-01-01
- `date_to` — filter to date e.g. 2026-04-30

## Testing
```bash
pytest
```