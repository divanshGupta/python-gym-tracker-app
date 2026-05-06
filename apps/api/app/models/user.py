from sqlalchemy import Integer, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    # Like mongoose populate — lazy="selectin" auto-loads related data
    goals:        Mapped[list["Goal"]]             = relationship("Goal", back_populates="user")
    measurements: Mapped[list["BodyMeasurement"]]  = relationship("BodyMeasurement", back_populates="user")
    workouts: Mapped[list["Workout"]] = relationship("Workout", back_populates="user", lazy="selectin")