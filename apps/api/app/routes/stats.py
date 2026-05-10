# apps/api/app/routers/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.database import get_db
from app.models.user import User
from app.models.workout import Workout
from app.models.workout_exercise import WorkoutExercise
from app.models.exercise import Exercise
from app.utils.dependencies import get_current_user
from datetime import date, timedelta

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
    

@router.get("/streak")
async def get_streak(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all workout dates for user, ordered descending
    result = await db.execute(
        select(Workout.date)
        .where(Workout.user_id == current_user.id)
        .order_by(Workout.date.desc())
    )
    dates = [row[0] for row in result.all()]

    if not dates:
        return {"current_streak": 0, "longest_streak": 0, "last_workout": None}

    # Current streak
    current_streak = 0
    check_date = date.today()

    # Allow today or yesterday as starting point
    if dates[0] < check_date - timedelta(days=1):
        current_streak = 0
    else:
        for d in dates:
            if d == check_date or d == check_date - timedelta(days=1):
                current_streak += 1
                check_date = d - timedelta(days=1)
            else:
                break

    # Longest streak
    longest_streak = 1
    current_run = 1
    for i in range(1, len(dates)):
        if dates[i] == dates[i - 1] - timedelta(days=1):
            current_run += 1
            longest_streak = max(longest_streak, current_run)
        else:
            current_run = 1

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "last_workout": str(dates[0]),
    }

@router.get("/progress/{exercise_id}")
async def get_exercise_progress(
    exercise_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Workout.date, func.max(WorkoutExercise.weight).label("max_weight"))
        .join(WorkoutExercise, WorkoutExercise.workout_id == Workout.id)
        .where(
            Workout.user_id == current_user.id,
            WorkoutExercise.exercise_id == exercise_id,
            WorkoutExercise.weight > 0
        )
        .group_by(Workout.date)
        .order_by(Workout.date.asc())
    )
    rows = result.all()

    # Volume = sets * reps * weight per session
    volume_result = await db.execute(
        select(
            Workout.date,
            func.sum(WorkoutExercise.sets * WorkoutExercise.reps * WorkoutExercise.weight).label("volume")
        )
        .join(WorkoutExercise, WorkoutExercise.workout_id == Workout.id)
        .where(
            Workout.user_id == current_user.id,
            WorkoutExercise.exercise_id == exercise_id,
            WorkoutExercise.weight > 0
        )
        .group_by(Workout.date)
        .order_by(Workout.date.asc())
    )
    volume_rows = volume_result.all()

    return {
        "exercise_id": exercise_id,
        "max_weight_over_time": [
            {"date": str(r[0]), "max_weight": float(r[1])} for r in rows
        ],
        "volume_over_time": [
            {"date": str(r[0]), "volume": float(r[1]) if r[1] else 0} for r in volume_rows
        ]
    }