# GymTracker

A production-grade, cross-platform fitness tracking application built as a full-stack monorepo. Covers workout logging, contribution heatmaps, streak tracking, personal bests, and a **rule-based progressive overload engine** that analyzes training history and surfaces actionable weight progression suggestions.

> Built to production standards: shared packages, typed API contracts, tested across three layers, and deployed via CI/CD.

---

## Screenshots

> (web dashboard, mobile progress screen, progression suggestion card)

---

## What makes this interesting

Most fitness app tutorials stop at CRUD. This project goes further:

- **Progressive overload engine** — a pure-function service that applies linear periodization rules to a user's last 5 sessions per exercise, detecting plateaus and suggesting weight adjustments. Fully unit tested with pytest.
- **Monorepo with shared packages** — React web and React Native share types, hooks, stores, API client, and constants. Zero duplication of business logic across platforms.
- **Three-layer test suite** — pure utility functions (Vitest), React Query hooks (Vitest + renderHook), and Python service logic (pytest). 21 tests total.
- **CI/CD via GitHub Actions** — every push runs the full test suite. Branch protection blocks merges when tests fail.
- **Contribution heatmap** — GitHub-style activity grid built from scratch, computed from a dense calendar of workout data with streak detection including a grace-day rule.

---

## Tech Stack

### Frontend

| Layer  | Technology                                      |
| ------ | ----------------------------------------------- |
| Web    | React 19 + Vite + Tailwind v4                   |
| Mobile | React Native + Expo 54 + NativeWind v2          |
| State  | Zustand (local) + TanStack Query v5 (server)    |
| Charts | Recharts (web), react-native-chart-kit (mobile) |

### Backend

| Layer         | Technology                 |
| ------------- | -------------------------- |
| API           | FastAPI + Pydantic v2      |
| ORM           | SQLAlchemy 2.0 async       |
| Database      | PostgreSQL 16              |
| Migrations    | Alembic                    |
| Auth          | JWT (python-jose) + bcrypt |
| Rate limiting | slowapi                    |

### Infrastructure

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Monorepo   | pnpm workspaces                                |
| Containers | Docker + docker-compose                        |
| CI/CD      | GitHub Actions                                 |
| Deployment | Railway (API), Vercel (web), Expo EAS (mobile) |

---

## Architecture

```
gymtracker/
├── apps/
│   ├── web/              # React 19 + Vite
│   ├── mobile/           # React Native + Expo 54
│   └── api/              # FastAPI
│
└── packages/
    ├── types/            # Shared TypeScript interfaces
    ├── api-client/       # Axios instance + typed API methods
    ├── hooks/            # React Query hooks (useWorkoutStats, useStreak, etc.)
    ├── stores/           # Zustand stores (auth, workout session)
    ├── utils/            # Pure utility functions (streak calc, contributions)
    ├── constants/        # Query keys, design tokens, app constants
    └── tailwind-config/  # Shared Tailwind preset + NativeWind tokens
```

### State architecture

Two separate systems, intentionally kept apart:

```
Server state  → TanStack Query  (fetched, cached, invalidated)
Local state   → Zustand         (in-progress workout session, auth)
```

Zustand never holds server data. When a workout is saved, a React Query mutation posts to the API, then `invalidateQueries` triggers a refetch. Zustand resets to idle.

### Progressive overload engine

```
GET /suggestions/{exercise_id}
  → query last 5 WorkoutExercise rows (joined with Workout for date)
  → map to WorkoutSession dataclasses
  → analyze_progression(exercise_id, exercise_name, sessions)
      → sort by date descending
      → apply rules: struggling / recently increased / consistent + strong
      → return ProgressionResult with suggestion + suggestion_text
```

Rules applied (in priority order):

1. `insufficient_data` — fewer than 3 sessions
2. `reduce_weight` — latest reps ≤ 5 (struggling)
3. `maintain` — weight increased recently (still adapting)
4. `increase_weight` — same weight for 3 sessions, reps ≥ 8 all three
5. `maintain` — default (working toward rep target)

Weight increment: 2.5kg (barbell/default), 2.0kg (dumbbell).

---

## Testing

```
packages/utils    11 tests   calculateStreaks pure function (Vitest)
packages/hooks     5 tests   useWorkoutStats, useStreak hooks (Vitest)
apps/api           5 tests   analyze_progression service (pytest)
─────────────────────────────────────────────────────────────────
Total             21 tests   all passing
```

### Run all JS/TS tests

```bash
pnpm test
```

### Run Python tests (unit only, no server needed)

```bash
cd apps/api
pytest test_progression_unit.py -v
```

### Run Python integration tests (requires database)

```bash
cd apps/api
pytest tests/ -v
```

---

## Local Setup

### Prerequisites

- Node.js 24+
- pnpm 11+
- Python 3.13+
- Docker Desktop

### 1. Clone and install

```bash
git clone https://github.com/divanshGupta/python-gym-tracker-app.git
pnpm install
```

### 2. Backend environment

Create `apps/api/.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/gymdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=gymdb
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run migrations

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\Activate   # Windows
pip install -r requirements.txt
alembic upgrade head
```

### 5. Start the API

```bash
uvicorn app.main:app --reload
```

### 6. Start the web app

```bash
pnpm run dev
or
pnpm --filter @gymtracker/web dev # at root
```

### 7. Start the mobile app

```bash
# Create apps/mobile/.env
echo "EXPO_PUBLIC_API_URL=http://<your-local-ip>:8000" > apps/mobile/.env

npx expo start -c
or
pnpm --filter @gymtracker/mobile start -c # at root
```

---

## API Reference

| Method | Path                    | Auth  | Description                     |
| ------ | ----------------------- | ----- | ------------------------------- |
| POST   | `/auth/register`        | No    | Register user                   |
| POST   | `/auth/login`           | No    | Login, receive JWT              |
| POST   | `/auth/refresh`         | Token | Refresh access token            |
| GET    | `/user/profile`         | Yes   | Current user profile            |
| GET    | `/exercises`            | No    | List all exercises              |
| POST   | `/exercises`            | Yes   | Create custom exercise          |
| GET    | `/workouts`             | Yes   | List workouts (paginated)       |
| GET    | `/workouts/{id}`        | Yes   | Single workout detail           |
| POST   | `/workouts`             | Yes   | Log a workout                   |
| PUT    | `/workouts/{id}`        | Yes   | Update workout                  |
| DELETE | `/workouts/{id}`        | Yes   | Delete workout                  |
| GET    | `/stats/summary`        | Yes   | Workout summary stats           |
| GET    | `/stats/personal_bests` | Yes   | Max weight per exercise         |
| GET    | `/stats/streak`         | Yes   | Current + longest streak        |
| GET    | `/stats/contributions`  | Yes   | Heatmap data                    |
| GET    | `/stats/progress/{id}`  | Yes   | Exercise progress over time     |
| GET    | `/suggestions/{id}`     | Yes   | Progressive overload suggestion |

API docs available at `http://localhost:8000/docs`

---

## CI/CD

GitHub Actions runs on every push to `main` and feature branches:

```yaml
Install Node → Install pnpm → pnpm install → pnpm test
```

Branch protection on `main` requires the `test` job to pass before merging.

---

## Key decisions

**Why pnpm workspaces?**
Shared packages (`@gymtracker/hooks`, `@gymtracker/types` etc.) need to be consumed by both web and mobile without publishing to npm. pnpm workspaces with `workspace:*` protocol handles this with symlinks, zero build step.

**Why Vitest over Jest?**
The web app uses Vite. Vitest shares the same config and transform pipeline — no separate Babel setup, native ESM support, identical API to Jest. Jest + MSW v2 in a Vite monorepo requires extensive polyfilling of browser globals that Vitest handles natively.

**Why two state systems?**
Server state (workouts, stats) has different lifecycle requirements than local state (in-progress session, auth token). Mixing them in one store leads to stale data and complex invalidation logic. TanStack Query owns server state; Zustand owns ephemeral local state.

**Why a separate service layer in FastAPI?**
`analyze_progression` lives in `services/progression.py`, not in the router. This makes it testable as a pure function without spinning up FastAPI, a database, or auth. The router only handles HTTP concerns.
