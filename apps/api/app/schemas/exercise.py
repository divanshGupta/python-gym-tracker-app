from pydantic import BaseModel, field_validator
from typing import Optional

class ExerciseCreate(BaseModel):
    name:         str
    category:     str
    muscle_group: str | None = None   # optional — cardio/flexibility often N/A
    equipment:    str | None = None   # defaults to "none" in model
    description:  str | None = None

    # Always save name lowercase for consistent dedup check
    @field_validator("name")
    @classmethod
    def lowercase_name(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("category")
    @classmethod
    def lowercase_category(cls, v: str) -> str:
        return v.strip().lower()
    
class ExerciseUpdate(BaseModel):
    name:         str 
    category:     str 
    muscle_group: str | None = None   
    equipment:    str | None = None  
    description:  str | None = None

    # Always save name lowercase for consistent dedup check
    @field_validator("name")
    @classmethod
    def lowercase_name(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("category")
    @classmethod
    def lowercase_category(cls, v: str) -> str:
        return v.strip().lower()

class ExerciseResponse(BaseModel):
    id:           int
    name:         str
    category:     str
    muscle_group: str | None
    equipment:    str
    description:  str | None
    is_custom:    bool

    model_config = {"from_attributes": True}