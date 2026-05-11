# apps/api/routes/exercise.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.exercise import Exercise
from app.models.user import User
from app.schemas.exercise import ExerciseCreate, ExerciseResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/exercises", tags=["Exercises"])

@router.get("/", response_model=list[ExerciseResponse])
async def get_exercises(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Exercise))
    return result.scalars().all()

@router.post("/", response_model=ExerciseResponse, status_code=201)
async def create_exercise(
    data: ExerciseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # name is already lowercased by validator
    result = await db.execute(
        select(Exercise).where(Exercise.name == data.name)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Exercise already exists")

    exercise = Exercise(
        name=         data.name,
        category=     data.category,
        muscle_group= data.muscle_group or "none",   # fallback for NOT NULL
        equipment=    data.equipment    or "none",
        description=  data.description,
        is_custom=    True,
        created_by=   current_user.id,
    )
    db.add(exercise)
    await db.commit()
    await db.refresh(exercise)
    return exercise