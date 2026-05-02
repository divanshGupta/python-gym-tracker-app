from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.goal import Goal, GoalProgress
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse, GoalProgressCreate, GoalProgressResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("/", response_model=list[GoalResponse])
async def get_goals(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Goal).where(Goal.user_id == current_user.id)
    if status:
        query = query.where(Goal.status == status)
    query = query.order_by(Goal.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=GoalResponse, status_code=201)
async def create_goal(
    data: GoalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = Goal(**data.model_dump(), user_id=current_user.id, status="active")
    db.add(goal)
    await db.flush()
    await db.refresh(goal)
    return goal


@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.patch("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: int,
    data: GoalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    await db.flush()
    await db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=204)
async def delete_goal(
    goal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    await db.delete(goal)


@router.post("/{goal_id}/progress", response_model=GoalProgressResponse, status_code=201)
async def log_progress(
    goal_id: int,
    data: GoalProgressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    entry = GoalProgress(**data.model_dump(), goal_id=goal_id, user_id=current_user.id)
    db.add(entry)

    # Update current_value on the goal
    goal.current_value = data.value
    if goal.target_value and data.value >= goal.target_value:
        goal.status = "completed"

    await db.flush()
    await db.refresh(entry)
    return entry