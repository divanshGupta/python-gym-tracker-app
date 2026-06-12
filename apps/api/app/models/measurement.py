# apps/api/models/measurement.py
from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import Integer, String, Float, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User

class BodyMeasurement(Base):
    __tablename__ = "body_measurements"

    id:          Mapped[int]   = mapped_column(Integer, primary_key=True, index=True)
    user_id:     Mapped[int]   = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date:        Mapped[Date]  = mapped_column(Date, nullable=False, index=True)
    weight_kg:   Mapped[float] = mapped_column(Float, nullable=False)
    height_cm:   Mapped[float | None] = mapped_column(Float, nullable=True)   # optional; used to compute BMI
    bmi:         Mapped[float | None] = mapped_column(Float, nullable=True)   # stored computed value
    notes:       Mapped[str | None] = mapped_column(String(300), nullable=True)
    created_at:  Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="measurements")