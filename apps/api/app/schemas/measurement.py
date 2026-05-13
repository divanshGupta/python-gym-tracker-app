# apps/api/schemas/measurement.py
from pydantic import BaseModel, model_validator
from datetime import date, datetime
from typing import Optional


class MeasurementCreate(BaseModel):
    date: date
    weight_kg: float
    height_cm: Optional[float] = None
    notes: Optional[str] = None


class MeasurementResponse(BaseModel):
    id: int
    user_id: int
    date: date
    weight_kg: float
    height_cm: Optional[float]
    bmi: Optional[float]
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}