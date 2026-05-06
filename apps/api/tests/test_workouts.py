import pytest
from httpx import AsyncClient

WORKOUT_PAYLOAD = {
    "date": "2026-04-30",
    "type": "Strength",
    "duration": 60,
    "calories": 400,
    "notes": "Good session",
    "exercises": []
}

@pytest.mark.asyncio
async def test_create_workout(auth_client: AsyncClient):
    res = await auth_client.post("/workouts", json=WORKOUT_PAYLOAD)
    assert res.status_code == 201
    data = res.json()
    assert data["type"] == "Strength"
    assert data["duration"] == 60

@pytest.mark.asyncio
async def test_get_workouts(auth_client: AsyncClient):
    res = await auth_client.get("/workouts")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

@pytest.mark.asyncio
async def test_get_workout_by_id(auth_client: AsyncClient):
    create_res = await auth_client.post("/workouts", json=WORKOUT_PAYLOAD)
    workout_id = create_res.json()["id"]
    res = await auth_client.get(f"/workouts/{workout_id}")
    assert res.status_code == 200
    assert res.json()["id"] == workout_id

@pytest.mark.asyncio
async def test_get_workout_not_found(auth_client: AsyncClient):
    res = await auth_client.get("/workouts/99999")
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_update_workout(auth_client: AsyncClient):
    create_res = await auth_client.post("/workouts", json=WORKOUT_PAYLOAD)
    workout_id = create_res.json()["id"]
    res = await auth_client.put(f"/workouts/{workout_id}", json={"notes": "Updated notes"})
    assert res.status_code == 200
    assert res.json()["notes"] == "Updated notes"

@pytest.mark.asyncio
async def test_delete_workout(auth_client: AsyncClient):
    create_res = await auth_client.post("/workouts", json=WORKOUT_PAYLOAD)
    workout_id = create_res.json()["id"]
    res = await auth_client.delete(f"/workouts/{workout_id}")
    assert res.status_code == 204
    get_res = await auth_client.get(f"/workouts/{workout_id}")
    assert get_res.status_code == 404

@pytest.mark.asyncio
async def test_workout_pagination(auth_client: AsyncClient):
    res = await auth_client.get("/workouts?page=1&limit=2")
    assert res.status_code == 200
    assert len(res.json()) <= 2

@pytest.mark.asyncio
async def test_workout_filter_by_type(auth_client: AsyncClient):
    res = await auth_client.get("/workouts?type=Strength")
    assert res.status_code == 200
    for w in res.json():
        assert w["type"] == "Strength"

@pytest.mark.asyncio
async def test_unauthenticated_access(client: AsyncClient):
    res = await client.get("/workouts")
    assert res.status_code == 403