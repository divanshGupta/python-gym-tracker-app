from sqlalchemy import Integer, String, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class Workout(Base):
    __tablename__ = "workouts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False)       # Strength, Cardio etc
    duration: Mapped[int] = mapped_column(Integer, nullable=True)       # minutes
    calories: Mapped[int] = mapped_column(Integer, nullable=True)
    notes: Mapped[str] = mapped_column(String(500), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="workouts")
    workout_exercises: Mapped[list["WorkoutExercise"]] = relationship(
        "WorkoutExercise", back_populates="workout", lazy="selectin", cascade="all, delete-orphan"
    )