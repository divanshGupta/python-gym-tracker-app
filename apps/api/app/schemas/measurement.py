from pydantic import BaseModel, model_validator
from datetime import date, datetime
from typing import Optional


class MeasurementCreate(BaseModel):
    date: date
    weight_kg: float
    height_cm: Optional[float] = None
    notes: Optional[str] = None

    @model_validator(mode="after")
    def compute_bmi(self) -> "MeasurementCreate":
        # BMI is computed in the route so the model stays clean;
        # height can come from a previous entry. This validator is a no-op.
        return self


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