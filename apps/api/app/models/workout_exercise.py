from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.exercise import Exercise
    from app.models.workout import Workout
    
# Join table with extra fields — like a Mongoose subdocument
class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    workout_id: Mapped[int] = mapped_column(Integer, ForeignKey("workouts.id"), nullable=False, index=True)
    exercise_id: Mapped[int] = mapped_column(Integer, ForeignKey("exercises.id"), nullable=False, index=True)
    sets: Mapped[int] = mapped_column(Integer, nullable=True)
    reps: Mapped[int] = mapped_column(Integer, nullable=True)
    weight: Mapped[float] = mapped_column(Float, nullable=True)         # kg

    workout: Mapped["Workout"] = relationship("Workout", back_populates="workout_exercises")
    exercise: Mapped["Exercise"] = relationship("Exercise", back_populates="workout_exercises", lazy="selectin")