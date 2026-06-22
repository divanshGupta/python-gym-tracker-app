# apps/api/routes/suggestions.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from dataclasses import asdict
from app.database import get_db
from app.models.workout_exercise import WorkoutExercise
from app.models.exercise import Exercise
from app.models.workout import Workout
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.services.progression import analyze_progression, WorkoutSession


import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/suggestions", tags=["suggestions"])


@router.get("/{exercise_id}")
async def get_progression_suggestion(
    exercise_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Query last 5 WorkoutExercise rows for this user + exercise
    #    joined with Workout to get the date
    result = await db.execute(
        select(
            WorkoutExercise,
            Workout.date,
            Exercise.name,
            Exercise.equipment,
        )
        .join(WorkoutExercise.workout)
        .join(WorkoutExercise.exercise)
        .where(
            WorkoutExercise.exercise_id == exercise_id,
            Workout.user_id == current_user.id,
            WorkoutExercise.weight.is_not(None),
            WorkoutExercise.reps.is_not(None),
            WorkoutExercise.sets.is_not(None),
        )
        .order_by(Workout.date.desc())
        .limit(3)
    )

    rows = result.all()

    exercise_name = rows[0][2] if rows else ""

    # 2. Convert rows to list[WorkoutSession]
    sessions = []
    for workout_exercise, workout_date, name, equipment in rows:
        sessions.append(WorkoutSession(
            date=workout_date,
            weight=workout_exercise.weight,
            reps=workout_exercise.reps,
            sets=workout_exercise.sets,
            equipment=equipment,
        ))
    
    # 3. Call analyze_progression and return result
    suggestion = analyze_progression(exercise_id, exercise_name, sessions)

    # Return schema instead of asdict
    # in FastAPI it's usually better to use Pydantic response models.
    # class ProgressionResponse(BaseModel):
    # exercise_id: int
    # exercise_name: str
    # ...
    # @router.get(
    # "/{exercise_id}",
    #     response_model=ProgressionResponse,
    # )/

    logger.debug(f"user_id: {current_user.id}, exercise_id: {exercise_id}, rows: {len(rows)}")
    return asdict(suggestion)


# this route currently does:
# SQL query
# ↓
# row conversion
# ↓
# business logic
# ↓
# serialization

# Eventually you may want:

# services/
#     progression.py
#     suggestion_service.py

# where:

# sessions = await get_recent_sessions(...)

# is handled in a service.

# Not necessary now, but something I'd do as the project grows.


# 3. Use a list comprehension

# Not required, but cleaner:

# sessions = [
#     WorkoutSession(
#         date=workout_date,
#         weight=workout_exercise.weight,
#         reps=workout_exercise.reps,
#         sets=workout_exercise.sets,
#         equipment=equipment,
#     )
#     for workout_exercise, workout_date, name, equipment in rows
# ]

# One architectural improvement for later

# Right now you're doing:

# Route
#  ├─ Query database
#  ├─ Convert rows
#  ├─ Analyze progression
#  └─ Return result

# As the app grows, I'd move the database query into a service/repository:

# sessions = await get_recent_exercise_sessions(...)
# suggestion = analyze_progression(...)