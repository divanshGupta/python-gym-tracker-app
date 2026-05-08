from typing import TYPE_CHECKING
from sqlalchemy import Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.workout_exercise import WorkoutExercise

class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    category: Mapped[str] = mapped_column(String(50), nullable=False)

    muscle_group: Mapped[str] = mapped_column(String(50), nullable=False)

    equipment: Mapped[str] = mapped_column(
        String(50),
        default="none",
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_custom: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    created_by: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    workout_exercises: Mapped[list["WorkoutExercise"]] = relationship(
        "WorkoutExercise",
        back_populates="exercise"
    )