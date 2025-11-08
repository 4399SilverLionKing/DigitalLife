from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlmodel import select, desc
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.models import Creation as DBCreation
from app.models import Comment as DBComment
from app.schemas.base_response import BaseResponse
from app.schemas.creation import Creation as CreationSchema
from app.schemas.comment import Comment as CommentSchema

router = APIRouter(prefix="/creations", tags=["creations"])


class CreationListResponse(BaseResponse):
    data: List[CreationSchema]


class CreationDetailResponse(BaseResponse):
    data: CreationSchema


class CreationCommentListResponse(BaseResponse):
    data: List[CommentSchema]


class CreationLikeResponse(BaseResponse):
    message: str = "Like added successfully"
    data: dict = {}


class CreationCommentCreateRequest(BaseModel):
    content: str = Field(..., min_length=1, description="Comment content")


class CreationCommentCreateResponse(BaseResponse):
    message: str = "Comment created successfully"
    data: CommentSchema


@router.get("", response_model=CreationListResponse)
async def list_creations(
    num: int = Query(10, ge=1, le=100, description="Number of creations to return"),
    session: AsyncSession = Depends(get_session),
) -> CreationListResponse:
    """Return the latest creations with an optional limit."""
    statement = select(DBCreation).order_by(desc(DBCreation.created_at)).limit(num)
    result = await session.exec(statement)
    creations = result.all()
    creations_schema = [CreationSchema.model_validate(record) for record in creations]
    return CreationListResponse(data=creations_schema)


@router.get("/{creation_id}", response_model=CreationDetailResponse)
async def get_creation_detail(
    creation_id: int,
    session: AsyncSession = Depends(get_session),
) -> CreationDetailResponse:
    """Return a creation detail by id."""
    statement = select(DBCreation).where(DBCreation.id == creation_id)
    result = await session.exec(statement)
    creation = result.first()

    if not creation:
        raise HTTPException(status_code=404, detail="Creation not found")

    return CreationDetailResponse(data=CreationSchema.model_validate(creation))


@router.get("/{creation_id}/comments", response_model=CreationCommentListResponse)
async def list_creation_comments(
    creation_id: int,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=50, description="Items per page"),
    session: AsyncSession = Depends(get_session),
) -> CreationCommentListResponse:
    """Return paginated comments for a given creation."""
    # Validate creation existence to align with API contract.
    creation_statement = select(DBCreation.id).where(DBCreation.id == creation_id)
    creation_result = await session.exec(creation_statement)
    if not creation_result.first():
        raise HTTPException(status_code=404, detail="Creation not found")

    offset = (page - 1) * limit
    comment_statement = (
        select(DBComment)
        .where(DBComment.creation_id == creation_id)
        .order_by(desc(DBComment.created_at))
        .offset(offset)
        .limit(limit)
    )
    comment_result = await session.exec(comment_statement)
    comments = comment_result.all()
    comments_schema = [CommentSchema.model_validate(record) for record in comments]

    return CreationCommentListResponse(data=comments_schema)


@router.post("/{creation_id}/like", response_model=CreationLikeResponse)
async def like_creation(
    creation_id: int,
    session: AsyncSession = Depends(get_session),
) -> CreationLikeResponse:
    """Increment like counter for a creation."""
    statement = select(DBCreation).where(DBCreation.id == creation_id)
    result = await session.exec(statement)
    creation = result.first()
    if not creation:
        raise HTTPException(status_code=404, detail="Creation not found")

    creation.likes += 1
    session.add(creation)
    await session.commit()
    return CreationLikeResponse()


@router.post("/{creation_id}/comments", response_model=CreationCommentCreateResponse)
async def create_creation_comment(
    creation_id: int,
    payload: CreationCommentCreateRequest,
    session: AsyncSession = Depends(get_session),
) -> CreationCommentCreateResponse:
    """Create a new comment for the given creation."""
    statement = select(DBCreation).where(DBCreation.id == creation_id)
    result = await session.exec(statement)
    creation = result.first()
    if not creation:
        raise HTTPException(status_code=404, detail="Creation not found")

    db_comment = DBComment(content=payload.content, creation_id=creation_id)
    creation.comments += 1

    session.add(db_comment)
    session.add(creation)
    await session.commit()
    await session.refresh(db_comment)

    return CreationCommentCreateResponse(
        data=CommentSchema.model_validate(db_comment)
    )
