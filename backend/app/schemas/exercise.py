from pydantic import BaseModel

class ExerciseCreate(BaseModel):
    name: str
    category: str  # Strength, Cardio, Flexibility etc

class ExerciseResponse(BaseModel):
    id: int
    name: str
    category: str

    model_config = {"from_attributes": True}