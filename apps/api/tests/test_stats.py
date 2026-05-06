import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_stats_summary(auth_client: AsyncClient):
    res = await auth_client.get("/stats/summary")
    assert res.status_code == 200
    data = res.json()
    assert "total_workouts" in data
    assert "total_duration_minutes" in data
    assert "total_calories_burned" in data
    assert "workouts_by_type" in data

@pytest.mark.asyncio
async def test_get_personal_bests(auth_client: AsyncClient):
    res = await auth_client.get("/stats/personal_bests")
    assert res.status_code == 200
    assert "personal_bests" in res.json()