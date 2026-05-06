import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_exercises_public(client: AsyncClient):
    res = await client.get("/exercises")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

@pytest.mark.asyncio
async def test_create_exercise(auth_client: AsyncClient):
    res = await auth_client.post("/exercises", json={
        "name": "Test Exercise",
        "category": "Strength"
    })
    assert res.status_code == 201
    assert res.json()["name"] == "Test Exercise"

@pytest.mark.asyncio
async def test_create_duplicate_exercise(auth_client: AsyncClient):
    payload = {"name": "Unique Exercise", "category": "Cardio"}
    await auth_client.post("/exercises", json=payload)
    res = await auth_client.post("/exercises", json=payload)
    assert res.status_code == 400