# apps/api/routes/exercise.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.exercise import Exercise
from app.models.user import User
from app.schemas.exercise import ExerciseCreate, ExerciseResponse, ExerciseUpdate
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/exercises", tags=["Exercises"])

@router.get("/", response_model=list[ExerciseResponse])
async def get_exercises(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
    # pagination
):
    result = await db.execute(
        select(Exercise).where(
            (Exercise.is_custom == False) |          # global seeded exercises
            (Exercise.created_by == current_user.id) # this user's custom ones
        )
    )
    return result.scalars().all()

@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Exercise).where(
            (Exercise.id == exercise_id),
            ((Exercise.is_custom == False) |
            (Exercise.created_by == current_user.id))
        )
    )
    exercise = result.scalar_one_or_none()
    if not exercise:
        raise HTTPException(status_code=404, detail="exercise not found")
    return exercise

@router.post("/", response_model=ExerciseResponse, status_code=201)
async def create_exercise(
    data: ExerciseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # name is already lowercased by validator
    result = await db.execute(
        select(Exercise).where(
            Exercise.name == data.name,
            Exercise.created_by == current_user.id 
        )
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

# --------- helper function --------------
async def get_owned_exercise(exercise_id: int, db: AsyncSession, current_user: User) -> Exercise:
    exercise = await db.get(Exercise, exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    if not exercise.is_custom or exercise.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="You don't have permission to modify this exercise")
    return exercise

@router.patch("/{exercise_id}", response_model=ExerciseResponse, status_code=200)
async def update_exercise(
    exercise_id: int,
    data: ExerciseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exercise = await get_owned_exercise(exercise_id, db, current_user)

    updates = data.model_dump(exclude_unset=True)

    # Only check for duplicates if the name is actually being changed
    if "name" in updates and updates["name"] != exercise.name:
        result = await db.execute(
            select(Exercise).where(
                Exercise.name == updates["name"],
                Exercise.created_by == current_user.id,
                Exercise.id != exercise_id,   # exclude the row we're editing
            )
        )
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Exercise already exists")

    for field, value in updates.items():
        setattr(exercise, field, value)

    await db.commit()
    await db.refresh(exercise)
    return exercise  

@router.delete("/{exercise_id}", status_code=204)
async def delete_exercise(
    exercise_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exercise = await get_owned_exercise(exercise_id, db, current_user)

    await db.delete(exercise)
    await db.commit()