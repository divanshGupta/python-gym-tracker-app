from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.exercise import Exercise

EXERCISES = [
    {
        "name": "Squat",
        "category": "strength",
        "muscle_group": "legs",
        "equipment": "barbell",
        "description": "Compound lower body movement."
    },

    {
        "name": "Bench Press",
        "category": "strength",
        "muscle_group": "chest",
        "equipment": "barbell",
        "description": "Horizontal pressing movement."
    },

    {
        "name": "Pull Up",
        "category": "strength",
        "muscle_group": "back",
        "equipment": "bodyweight",
        "description": "Vertical pulling exercise."
    },

    {
        "name": "Running",
        "category": "cardio",
        "muscle_group": "full_body",
        "equipment": "none",
        "description": "Cardiovascular endurance exercise."
    },
]

async def seed_exercises(db: AsyncSession):
    for item in EXERCISES:
        result = await db.execute(select(Exercise).where(Exercise.name == item["name"]))
        if not result.scalar_one_or_none():
            db.add(Exercise(
                name=item["name"],
                category=item["category"],
                muscle_group=item["muscle_group"],
                equipment=item["equipment"],
                description=item.get("description"),
                is_custom=False,
            ))
    await db.commit()
    print("✅ Exercises seeded")