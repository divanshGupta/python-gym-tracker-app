from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, LoginRequest, Token
from app.utils.auth import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.utils.logger import get_logger

router = APIRouter(prefix="/auth", tags=["Auth"])
bearer_scheme = HTTPBearer()
logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check email already exists
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password)
    )
    db.add(user)
    await db.flush()        # gets the ID without full commit
    logger.info(f"New user registerd: {user.username}")       # Logging
    return user

@router.post("/login", response_model=Token)
@limiter.limit("5/minute") # max 5 login attempts per minute per IP
async def login(request: Request, data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        logger.warning(f"Failed login attempt for email: {data.email}")     # Logging
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    logger.info(f"User logged in : {user.username}")      # Logging
    return Token(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id)
    )

@router.post("/refresh", response_model=Token)
async def refresh_token(
    db: AsyncSession = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    from fastapi.security import HTTPBearer
    token = credentials.credentials
    user_id = decode_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return Token(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id)
    )