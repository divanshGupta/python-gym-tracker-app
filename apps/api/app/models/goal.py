from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import Integer, String, Float, Date, DateTime, ForeignKey, func, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from app.database import Base

if TYPE_CHECKING:  
    from app.models.user import User
    from app.models.exercise import Exercise

class GoalType(str, enum.Enum):
    workout_frequency = "workout_frequency"   # X workouts per week
    lift_target       = "lift_target"         # reach X kg on exercise Y
    body_weight       = "body_weight"         # reach X kg bodyweight
    progressive_overload = "progressive_overload"  # increase lift by X% over N weeks


class GoalStatus(str, enum.Enum):
    active    = "active"
    completed = "completed"
    abandoned = "abandoned"


class Goal(Base):
    __tablename__ = "goals"

    id:          Mapped[int]   = mapped_column(Integer, primary_key=True, index=True)
    user_id:     Mapped[int]   = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title:       Mapped[str]   = mapped_column(String(100), nullable=False)
    goal_type:   Mapped[str]   = mapped_column(String(50), nullable=False)   # GoalType value
    target_value: Mapped[float] = mapped_column(Float, nullable=False)       # kg, reps, sessions/week
    current_value: Mapped[float] = mapped_column(Float, nullable=True)       # latest tracked value
    unit:        Mapped[str]   = mapped_column(String(20), nullable=True)    # "kg", "sessions", "%"
    exercise_id: Mapped[int]   = mapped_column(Integer, ForeignKey("exercises.id"), nullable=True)
    deadline:    Mapped[Date]  = mapped_column(Date, nullable=True)
    status:      Mapped[str]   = mapped_column(String(20), nullable=False, default="active")
    created_at:  Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    user:     Mapped["User"]     = relationship("User", back_populates="goals")
    exercise: Mapped["Exercise"] = relationship("Exercise")
    progress: Mapped[list["GoalProgress"]] = relationship(
        "GoalProgress", back_populates="goal", lazy="selectin", cascade="all, delete-orphan"
    )


class GoalProgress(Base):
    __tablename__ = "goal_progress"

    id:         Mapped[int]   = mapped_column(Integer, primary_key=True, index=True)
    goal_id:    Mapped[int]   = mapped_column(Integer, ForeignKey("goals.id"), nullable=False, index=True)
    user_id:    Mapped[int]   = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    value:      Mapped[float] = mapped_column(Float, nullable=False)
    date:       Mapped[Date]  = mapped_column(Date, nullable=False)
    notes:      Mapped[str]   = mapped_column(String(300), nullable=True)
    logged_at:  Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    goal: Mapped["Goal"] = relationship("Goal", back_populates="progress")