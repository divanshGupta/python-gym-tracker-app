# apps/api/routes/suggestions.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.exercise import Exercise
from app.models.user import User
from app.schemas.exercise import ExerciseCreate, ExerciseResponse
from app.utils.dependencies import get_current_user, get_current_user

async def suggestions(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(WorkoutExercise).where(
            WorkoutExercise.user_id == current_user.id
        ).filter(WorkoutExercise.exercise_id == Exercise.id)
        .order_by(WorkoutExercise.date.desc())
        .limit(5)
        .all()
    )
    return result.scalars().all()