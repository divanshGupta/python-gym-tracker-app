import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# slowapi is the flask-limiter for fastapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.routes.auth import router as auth_router
from app.routes.exercises import router as exercise_router
from app.routes.workouts import router as workout_router
from app.routes.user import router as user_router
from app.routes.stats import router as stats_router
from app.routes.goals import router as goals_router
from app.routes.measurements import router as measurements_router
from app.routes.suggestions import router as suggestions_router

from app.utils.error_handler import register_error_handlers
from app.database import AsyncSessionLocal
from app.utils.seed import seed_exercises

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Fitlogger API",
    version="1.0.0",
    docs_url="/docs", # Swagger UI
    redoc_url="/redoc"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

FRONTEND_URL= os.getenv("FRONTEND_URL")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL, 
        "http://192.168.1.105:5173", # Web from another device on network
        "http://192.168.1.105:8081", # Expo web
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# routes
app.include_router(auth_router)
app.include_router(exercise_router)
app.include_router(workout_router)
app.include_router(user_router)
app.include_router(stats_router)
app.include_router(goals_router)
app.include_router(measurements_router)
app.include_router(suggestions_router)

register_error_handlers(app)

@app.on_event("startup")
async def startup():
    async with AsyncSessionLocal() as db:
        await seed_exercises(db)

@app.get("/health")
async def health_check():
    return {"status": "ok"}