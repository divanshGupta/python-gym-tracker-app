from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.exercise import Exercise

EXERCISES = [
    # Strength
    {"name": "Squat", "category": "Strength"},
    {"name": "Deadlift", "category": "Strength"},
    {"name": "Bench Press", "category": "Strength"},
    {"name": "Overhead Press", "category": "Strength"},
    {"name": "Barbell Row", "category": "Strength"},
    {"name": "Pull Up", "category": "Strength"},
    {"name": "Dumbbell Curl", "category": "Strength"},
    {"name": "Tricep Dip", "category": "Strength"},
    {"name": "Leg Press", "category": "Strength"},
    {"name": "Lunges", "category": "Strength"},
    # Cardio
    {"name": "Running", "category": "Cardio"},
    {"name": "Cycling", "category": "Cardio"},
    {"name": "Jump Rope", "category": "Cardio"},
    {"name": "Rowing", "category": "Cardio"},
    {"name": "Stair Climber", "category": "Cardio"},
    # Flexibility
    {"name": "Yoga", "category": "Flexibility"},
    {"name": "Stretching", "category": "Flexibility"},
    # Core
    {"name": "Plank", "category": "Core"},
    {"name": "Crunches", "category": "Core"},
    {"name": "Leg Raises", "category": "Core"},
]

async def seed_exercises(db: AsyncSession):
    for item in EXERCISES:
        result = await db.execute(select(Exercise).where(Exercise.name == item["name"]))
        if not result.scalar_one_or_none():
            db.add(Exercise(name=item["name"], category=item["category"]))
    await db.commit()
    print("✅ Exercises seeded")