from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.database import get_db
from app.models.user import User
from app.models.workout import Workout
from app.models.workout_exercise import WorkoutExercise
from app.models.exercise import Exercise
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/summary")
async def get_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Total workouts
    total = await db.execute(
        select(func.count(Workout.id)).where(Workout.user_id == current_user.id)
    )
    total_workouts = total.scalar()

    # Total duration and calories
    totals = await db.execute(
        select(func.sum(Workout.duration), func.sum(Workout.calories))
        .where(Workout.user_id == current_user.id)
    )
    duration_sum, calories_sum = totals.one()

    # Workouts by type  e.g. {"Strength": 5, "Cardio": 3}
    by_type = await db.execute(
        select(Workout.type, func.count(Workout.id))
        .where(Workout.user_id == current_user.id)
        .group_by(Workout.type)
    )
    workouts_by_type = {row[0]: row[1] for row in by_type.all()}

    # Most logged exercise
    top_exercise = await db.execute(
        select(Exercise.name, func.count(WorkoutExercise.id).label("count"))
        .join(Exercise, WorkoutExercise.exercise_id == Exercise.id)
        .join(Workout, WorkoutExercise.workout_id == Workout.id)
        .where(Workout.user_id == current_user.id)
        .group_by(Exercise.name)
        .order_by(func.count(WorkoutExercise.id).desc())
        .limit(1)
    )
    top = top_exercise.one_or_none()

    return {
        "total_workouts": total_workouts,
        "total_duration_minutes": duration_sum or 0,
        "total_calories_burned": calories_sum or 0,
        "workouts_by_type": workouts_by_type,
        "most_logged_exercise": top[0] if top else None,
    }


@router.get("/personal_bests")
async def get_personal_bests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Max weight lifted per exercise for this user
    result = await db.execute(
        select(Exercise.name, func.max(WorkoutExercise.weight).label("max_weight"))
        .join(Exercise, WorkoutExercise.exercise_id == Exercise.id)
        .join(Workout, WorkoutExercise.workout_id == Workout.id)
        .where(
            and_(
                Workout.user_id == current_user.id,
                WorkoutExercise.weight > 0
            )
        )
        .group_by(Exercise.name)
        .order_by(func.max(WorkoutExercise.weight).desc())
    )
    rows = result.all()

    return {
        "personal_bests": [
            {"exercise": row[0], "max_weight_kg": row[1]} for row in rows
        ]
    }