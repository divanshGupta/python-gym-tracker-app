from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import Optional


class GoalProgressCreate(BaseModel):
    value: float
    date: date
    notes: Optional[str] = None


class GoalProgressResponse(BaseModel):
    id: int
    goal_id: int
    value: float
    date: date
    notes: Optional[str]
    logged_at: datetime

    model_config = {"from_attributes": True}


class GoalCreate(BaseModel):
    title: str
    goal_type: str
    target_value: float
    unit: Optional[str] = None
    exercise_id: Optional[int] = None
    deadline: Optional[date] = None

    @field_validator("goal_type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        allowed = {"workout_frequency", "lift_target", "body_weight", "progressive_overload"}
        if v not in allowed:
            raise ValueError(f"goal_type must be one of {allowed}")
        return v


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_value: Optional[float] = None
    deadline: Optional[date] = None
    status: Optional[str] = None


class GoalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    goal_type: str
    target_value: float
    current_value: Optional[float]
    unit: Optional[str]
    exercise_id: Optional[int]
    deadline: Optional[date]
    status: str
    created_at: datetime
    progress: list[GoalProgressResponse] = []

    model_config = {"from_attributes": True}