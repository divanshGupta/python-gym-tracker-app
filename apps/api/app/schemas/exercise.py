from pydantic import BaseModel
from typing import Optional

class ExerciseCreate(BaseModel):
    name: str
    category: str
    muscle_group: str
    equipment: str = "none"
    description: Optional[str] = None

class ExerciseResponse(BaseModel):
    id: int
    name: str
    category: str
    muscle_group: str
    equipment: str
    description: str | None
    is_custom: bool
    created_by: int | None

    model_config = {"from_attributes": True}