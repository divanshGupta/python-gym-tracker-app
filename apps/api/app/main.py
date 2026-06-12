from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# slowapi i sthe flask-limiter equivalent for fastapi
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="GymTracker API",
    version="1.0.0",
    docs_url="/docs",      # Swagger UI — free with FastAPI
    redoc_url="/redoc"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # temporary debug only
    allow_credentials=False, # must be false when using wildcard
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

        # "http://localhost:5173",      # vite web dev
        # "http://localhost:3000",      # alt web dev
        # "http://192.168.1.105:5173",  # Web from another device on network
        # "http://192.168.1.105:8081",  # Expo web

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