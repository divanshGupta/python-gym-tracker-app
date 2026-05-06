from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# Like mongoose.connect()
engine = create_async_engine(settings.DATABASE_URL, echo=True)

# Like a session factory — echo=True logs all SQL (turn off in prod)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Base class all models will inherit from
class Base(DeclarativeBase):
    pass

# Dependency — like req/res middleware, injected into routes
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise