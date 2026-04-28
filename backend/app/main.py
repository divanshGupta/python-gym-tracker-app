from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.exercises import router as exercise_router
from app.routes.workouts import router as workout_router
from app.routes.user import router as user_router
from app.routes.stats import router as stats_router

from app.utils.error_handler import register_error_handlers
from app.database import AsyncSessionLocal
from app.utils.seed import seed_exercises

app = FastAPI(
    title="GymTracker API",
    version="1.0.0",
    docs_url="/docs",      # Swagger UI — free with FastAPI
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(exercise_router)
app.include_router(workout_router)
app.include_router(user_router)
app.include_router(stats_router)

register_error_handlers(app)

@app.on_event("startup")
async def startup():
    async with AsyncSessionLocal() as db:
        await seed_exercises(db)

@app.get("/health")
async def health_check():
    return {"status": "ok"}