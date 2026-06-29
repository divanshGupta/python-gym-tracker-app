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
        val = v.strip().lower()
        allowed = {"strength", "cardio", "flexibility", "core"}
        if val not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return val

    @field_validator("muscle_group")
    @classmethod
    def validate_muscle_group(cls, v: str | None) -> str | None:
        if v is None:
            return v
        val = v.strip().lower()
        allowed = {"chest", "back", "shoulders", "arms", "legs", "core", "full_body"}
        if val not in allowed:
            raise ValueError(f"Muscle group must be one of {allowed}")
        return val

    @field_validator("equipment")
    @classmethod
    def validate_equipment(cls, v: str | None) -> str | None:
        if v is None:
            return v
        val = v.strip().lower()
        allowed = {"barbell", "dumbbell", "bodyweight", "machine", "cable", "kettlebell", "none"}
        if val not in allowed:
            raise ValueError(f"Equipment must be one of {allowed}")
        return val
    
class ExerciseUpdate(BaseModel):
    name:         str | None = None 
    category:     str | None = None 
    muscle_group: str | None = None   
    equipment:    str | None = None  
    description:  str | None = None

    # Always save name lowercase for consistent dedup check
    @field_validator("name")
    @classmethod
    def lowercase_name(cls, v: str | None) -> str | None:
        if v is None:
            return v
        return v.strip().lower()

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str | None) -> str | None:
        if v is None:
            return v
        val = v.strip().lower()
        allowed = {"strength", "cardio", "flexibility", "core"}
        if val not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return val

    @field_validator("muscle_group")
    @classmethod
    def validate_muscle_group(cls, v: str | None) -> str | None:
        if v is None:
            return v
        val = v.strip().lower()
        allowed = {"chest", "back", "shoulders", "arms", "legs", "core", "full_body"}
        if val not in allowed:
            raise ValueError(f"Muscle group must be one of {allowed}")
        return val

    @field_validator("equipment")
    @classmethod
    def validate_equipment(cls, v: str | None) -> str | None:
        if v is None:
            return v
        val = v.strip().lower()
        allowed = {"barbell", "dumbbell", "bodyweight", "machine", "cable", "kettlebell", "none"}
        if val not in allowed:
            raise ValueError(f"Equipment must be one of {allowed}")
        return val

class ExerciseResponse(BaseModel):
    id:           int
    name:         str
    category:     str
    muscle_group: str | None
    equipment:    str
    description:  str | None
    is_custom:    bool

    model_config = {"from_attributes": True}