# apps/api/app/routers/workouts.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from datetime import date
from app.database import get_db
from app.models.user import User
from app.models.workout import Workout
from app.models.workout_exercise import WorkoutExercise
from app.schemas.workout import WorkoutCreate, WorkoutResponse, WorkoutUpdate
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/workouts", tags=["Workouts"])

@router.get("/", response_model=list[WorkoutResponse])
async def get_workouts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    # Pagination
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
    # Filters
    type: str | None = Query(default=None),
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
):
    filters = [Workout.user_id == current_user.id]

    if type:
        filters.append(Workout.type == type)
    if date_from:
        filters.append(Workout.date >= date_from)
    if date_to:
        filters.append(Workout.date <= date_to)

    offset = (page - 1) * limit
    
    result = await db.execute(
        select(Workout)
        .where(and_(*filters))
        .order_by(Workout.date.desc())
        .offset(offset)
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/{workout_id}", response_model=WorkoutResponse)
async def get_workout(
    workout_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Workout).where(Workout.id == workout_id, Workout.user_id == current_user.id)
    )
    workout = result.scalar_one_or_none()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@router.post("/", response_model=WorkoutResponse, status_code=201)
async def create_workout(
    data: WorkoutCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = Workout(
        user_id=current_user.id,
        date=data.date,
        type=data.type,
        duration=data.duration,
        calories=data.calories,
        notes=data.notes
    )
    db.add(workout)
    await db.flush()  # get workout.id before adding exercises

    for ex in data.exercises:
        workout_exercise = WorkoutExercise(
            workout_id=workout.id,
            exercise_id=ex.exercise_id,
            sets=ex.sets,
            reps=ex.reps,
            weight=ex.weight
        )
        db.add(workout_exercise)

    await db.commit()

    # ✅ RE-FETCH with eager loading
    result = await db.execute(
        select(Workout)
        .options(
            selectinload(Workout.workout_exercises)
            .selectinload(WorkoutExercise.exercise)
        )
        .where(Workout.id == workout.id)
    )

    workout = result.scalar_one()

    return workout

@router.put("/{workout_id}", response_model=WorkoutResponse)
async def update_workout(
    workout_id: int,
    data: WorkoutUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Workout).where(Workout.id == workout_id, Workout.user_id == current_user.id)
    )
    workout = result.scalar_one_or_none()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    # Only update fields that were actually sent
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(workout, field, value)

    await db.flush()
    return workout

@router.delete("/{workout_id}", status_code=204)
async def delete_workout(
    workout_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Workout).where(Workout.id == workout_id, Workout.user_id == current_user.id)
    )
    workout = result.scalar_one_or_none()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    await db.delete(workout)