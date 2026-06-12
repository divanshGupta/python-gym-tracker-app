# GymTracker Monorepo

A scalable cross-platform fitness tracking application built with:

* React (Web)
* React Native + Expo (Mobile)
* FastAPI (Backend API)
* PostgreSQL
* Docker
* pnpm Monorepo Architecture

The project is structured as a modern monorepo with shared types, hooks, stores, API logic, and design tokens between web and mobile applications.

---

# Project Structure

```txt
gym-tracker/

├── apps/
│   ├── web/              # React web application
│   ├── mobile/           # React Native + Expo app
│   └── api/              # FastAPI backend
│
├── packages/
│   ├── api-client/       # Shared API layer
│   ├── hooks/            # Shared React Query hooks
│   ├── stores/           # Shared Zustand stores
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Shared utilities
│   ├── constants/        # Shared constants/design tokens
│   └── tailwind-config/  # Shared Tailwind/NativeWind config
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

# Tech Stack

## Frontend

* React
* React Native + Expo
* TypeScript
* TailwindCSS
* NativeWind
* Zustand
* TanStack Query

## Backend

* FastAPI
* SQLAlchemy 2.0 (async)
* PostgreSQL
* Alembic
* JWT Authentication
* Pydantic v2
* slowapi (rate limiting)

## DevOps / Tooling

* Docker
* pnpm Workspaces
* Monorepo Architecture

---

# Backend Setup (FastAPI)

## 1. Navigate to API Folder

```bash
cd apps/api
```

---

## 2. Create Virtual Environment

```bash
python -m venv .venv
```

---

## 3. Activate Virtual Environment

### Windows

```bash
.venv\Scripts\Activate
```

### macOS/Linux

```bash
source .venv/bin/activate
```

---

## 4. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 5. Configure Environment Variables

Create a `.env` file inside `apps/api`.

Example:

```env
DATABASE_URL=postgresql+asyncpg://postgres:${POSTGRES_PASSWORD}@localhost:5432/gymdb

POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=gymdb

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

# PostgreSQL Setup (Docker)

## Start Database

From project root:

```bash
docker compose up -d
```

---

## docker-compose.yml

```yaml
version: "3.9"

services:
  db:
    image: postgres:16
    container_name: gymtracker-db
    restart: always
    env_file:
      - .env
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

# Run Database Migrations

Inside `apps/api`:

```bash
alembic upgrade head
```

---

# Start Backend Server

Inside `apps/api`:

```bash
uvicorn app.main:app --reload
```

OR

```bash
python run.py
```

---

# API Documentation

Swagger UI:

```txt
http://localhost:8000/docs
```

Redoc:

```txt
http://localhost:8000/redoc
```

---

# Frontend Setup (Web)

Inside `apps/web`:

```bash
pnpm install
pnpm dev
```

---

# Mobile App Setup (Expo)

Inside `apps/mobile`:

```bash
pnpm install
pnpm start
```

---

# Shared Architecture

The monorepo shares the following systems between React web and React Native:

* API client
* React Query hooks
* Zustand stores
* TypeScript types
* utility functions
* constants
* color palette
* typography system
* spacing/radius tokens
* Tailwind preset
* validation schemas

UI rendering remains platform-specific where necessary.

---

# API Endpoints

| Method | Path                    | Auth  | Purpose               |
| ------ | ----------------------- | ----- | --------------------- |
| POST   | `/auth/register`        | No    | Register user         |
| POST   | `/auth/login`           | No    | Login and receive JWT |
| POST   | `/auth/refresh`         | Token | Refresh access token  |
| GET    | `/user/profile`         | Yes   | Current user profile  |
| GET    | `/exercises`            | No    | List exercises        |
| POST   | `/exercises`            | Yes   | Create exercise       |
| GET    | `/workouts`             | Yes   | List workouts         |
| GET    | `/workouts/{id}`        | Yes   | Single workout        |
| POST   | `/workouts`             | Yes   | Create workout        |
| PUT    | `/workouts/{id}`        | Yes   | Update workout        |
| DELETE | `/workouts/{id}`        | Yes   | Delete workout        |
| GET    | `/stats/summary`        | Yes   | Workout summary       |
| GET    | `/stats/personal_bests` | Yes   | Personal bests        |

---

# Query Parameters

## GET /workouts

| Param     | Description      |
| --------- | ---------------- |
| page      | Page number      |
| limit     | Results per page |
| type      | Workout type     |
| date_from | Start date       |
| date_to   | End date         |

---

# Testing

Inside `apps/api`:

```bash
pytest
```

---

# Architecture Philosophy

This project follows:

* Shared business logic
* Shared design system
* Shared API contracts
* Platform-specific presentation layer

The goal is to maintain consistency between web and mobile while preserving native UX patterns for each platform.

---

# Future Improvements

* Redis caching
* Push notifications
* Background jobs
* CI/CD pipelines
* Offline sync
* Analytics
* Dockerized API service
* Shared UI component library
* E2E testing
