from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.user import UserResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user