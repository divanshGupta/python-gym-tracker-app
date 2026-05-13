# apps/api/routes/measurements.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.measurement import BodyMeasurement
from app.models.user import User
from app.schemas.measurement import MeasurementCreate, MeasurementResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/measurements", tags=["Measurements"])

def _compute_bmi(weight_kg: float, height_cm: float | None) -> float | None:
    if not height_cm or height_cm <= 0:
        return None
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)


@router.get("/", response_model=list[MeasurementResponse])
async def get_measurements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(BodyMeasurement)
        .where(BodyMeasurement.user_id == current_user.id)
        .order_by(BodyMeasurement.date.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=MeasurementResponse, status_code=201)
async def log_measurement(
    data: MeasurementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # If no height provided, look up last known height for this user
    height_cm = data.height_cm
    if not height_cm:
        prev = await db.execute(
            select(BodyMeasurement.height_cm)
            .where(
                BodyMeasurement.user_id == current_user.id,
                BodyMeasurement.height_cm.isnot(None),
            )
            .order_by(BodyMeasurement.date.desc())
            .limit(1)
        )
        height_cm = prev.scalar_one_or_none()

    bmi = _compute_bmi(data.weight_kg, height_cm)

    entry = BodyMeasurement(
        **data.model_dump(exclude={"height_cm"}),   # exclude it from the spread
        user_id=current_user.id,
        height_cm=height_cm,        # use the resolved value (fallback to previous entry)
        bmi=bmi,
    )
    db.add(entry)

    await db.flush()
    await db.commit()
    await db.refresh(entry)

    return entry


@router.delete("/{measurement_id}", status_code=204)
async def delete_measurement(
    measurement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(BodyMeasurement).where(
            BodyMeasurement.id == measurement_id,
            BodyMeasurement.user_id == current_user.id,
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Measurement not found")
    await db.delete(entry)
    await db.commit()