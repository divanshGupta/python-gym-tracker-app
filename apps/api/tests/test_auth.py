import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    res = await client.post("/auth/register", json={
        "username": "newuser",
        "email": "new@test.com",
        "password": "password123"
    })
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "new@test.com"
    assert data["username"] == "newuser"
    assert "password_hash" not in data

@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {"username": "user2", "email": "dupe@test.com", "password": "pass1234"}
    await client.post("/auth/register", json=payload)
    res = await client.post("/auth/register", json=payload)
    assert res.status_code == 400
    assert "already registered" in res.json()["detail"]

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    await client.post("/auth/register", json={
        "username": "loginuser",
        "email": "login@test.com",
        "password": "pass1234"
    })
    res = await client.post("/auth/login", json={
        "email": "login@test.com",
        "password": "pass1234"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data

@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    res = await client.post("/auth/login", json={
        "email": "login@test.com",
        "password": "wrongpass"
    })
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_get_profile(auth_client: AsyncClient):
    res = await auth_client.get("/user/profile")
    assert res.status_code == 200
    assert res.json()["email"] == "test@test.com"