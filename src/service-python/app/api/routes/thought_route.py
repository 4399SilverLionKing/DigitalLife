from typing import List

from fastapi import APIRouter, Depends, Query
from sqlmodel import select, desc
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.models import Thought as DBThought
from app.schemas.base_response import BaseResponse
from app.schemas.thought import Thought as ThoughtSchema

router = APIRouter(prefix="/thoughts", tags=["thoughts"])


class ThoughtListResponse(BaseResponse):
    data: List[ThoughtSchema]


@router.get("", response_model=ThoughtListResponse)
async def list_thoughts(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    session: AsyncSession = Depends(get_session),
) -> ThoughtListResponse:
    """Return paginated thoughts ordered by most recent."""
    offset = (page - 1) * limit
    statement = (
        select(DBThought)
        .order_by(desc(DBThought.created_at))
        .offset(offset)
        .limit(limit)
    )
    result = await session.exec(statement)
    thoughts = result.all()
    thoughts_schema = [ThoughtSchema.model_validate(record) for record in thoughts]

    return ThoughtListResponse(data=thoughts_schema)
