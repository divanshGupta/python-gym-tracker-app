from pydantic import BaseModel
from datetime import date as date_type
from app.schemas.exercise import ExerciseResponse

class WorkoutExerciseCreate(BaseModel):
    exercise_id: int
    sets: int | None = None
    reps: int | None = None
    weight: float | None = None

class WorkoutExerciseResponse(BaseModel):
    id: int
    exercise_id: int
    sets: int | None
    reps: int | None
    weight: float | None
    exercise: ExerciseResponse

    model_config = {"from_attributes": True}

class WorkoutCreate(BaseModel):
    date: date_type
    type: str
    duration: int | None = None
    calories: int | None = None
    notes: str | None = None
    exercises: list[WorkoutExerciseCreate] = []

class WorkoutUpdate(BaseModel):
    date: date_type | None = None
    type: str | None = None
    duration: int | None = None
    calories: int | None = None
    notes: str | None = None

class WorkoutResponse(BaseModel):
    id: int
    user_id: int
    date: date_type
    type: str
    duration: int | None
    calories: int | None
    notes: str | None
    workout_exercises: list[WorkoutExerciseResponse] = []

    model_config = {"from_attributes": True}