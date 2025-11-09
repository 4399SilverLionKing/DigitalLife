# File: app/api/routes/creation.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select, desc
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.models import Creation, Comment  # 假设这些模型已在 app/models.py 中定义
from app.schemas.creation import (
    CreationListResponse,
    CreationReadList,
    CreationDetailResponse,
    CreationReadDetail,
    CommentListResponse,
    CommentRead,
    CreationLikeResponse,
    CreationLikeUpdate,
    CommentCreateResponse,
    CommentCreate,
)

router = APIRouter(prefix="/creations", tags=["Creations"])


@router.get("/", response_model=CreationListResponse, summary="获取作品列表")
async def get_creation_list(
    *,
    db: AsyncSession = Depends(get_session),
    page: int = Query(1, ge=1, description="页码，从1开始"),
    page_size: int = Query(10, ge=1, le=100, description="每页数量")
) -> CreationListResponse:
    """
    Asynchronously retrieves a paginated list of creations.
    """
    offset = (page - 1) * page_size
    statement = (
        select(Creation).offset(offset).limit(page_size).order_by(desc(Creation.id))
    )
    result = await db.exec(statement)
    creations_db = result.all()

    # 将数据库模型转换为Pydantic响应模型
    creations_data = [CreationReadList.model_validate(c) for c in creations_db]

    return CreationListResponse(data=creations_data)


@router.get(
    "/{creation_id}", response_model=CreationDetailResponse, summary="获取单个作品详情"
)
async def get_creation_detail(
    creation_id: int, db: AsyncSession = Depends(get_session)
) -> CreationDetailResponse:
    """
    Asynchronously retrieves the detailed information for a single creation by its ID.
    """
    creation_db = await db.get(Creation, creation_id)
    if not creation_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Creation not found"
        )

    creation_data = CreationReadDetail.model_validate(creation_db)
    return CreationDetailResponse(data=creation_data)


@router.get(
    "/{creation_id}/comments",
    response_model=CommentListResponse,
    summary="获取作品的评论列表",
)
async def get_creation_comments(
    creation_id: int,
    *,
    db: AsyncSession = Depends(get_session),
    page: int = Query(1, ge=1, description="页码，从1开始"),
    page_size: int = Query(10, ge=1, le=100, description="每页数量")
) -> CommentListResponse:
    """
    Asynchronously retrieves a paginated list of comments for a specific creation.
    """
    # 首先验证作品是否存在
    creation_db = await db.get(Creation, creation_id)
    if not creation_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Creation not found"
        )

    offset = (page - 1) * page_size
    statement = (
        select(Comment)
        .where(Comment.creation_id == creation_id)
        .offset(offset)
        .limit(page_size)
        .order_by(desc(Comment.id))
    )
    result = await db.exec(statement)
    comments_db = result.all()

    comments_data = [CommentRead.model_validate(c) for c in comments_db]
    return CommentListResponse(data=comments_data)


@router.post(
    "/{creation_id}/like", response_model=CreationLikeResponse, summary="点赞作品"
)
async def like_creation(
    creation_id: int, db: AsyncSession = Depends(get_session)
) -> CreationLikeResponse:
    """
    Asynchronously increments the like count for a specific creation.
    """
    creation_db = await db.get(Creation, creation_id)
    if not creation_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Creation not found"
        )

    creation_db.likes += 1
    db.add(creation_db)
    await db.commit()
    await db.refresh(creation_db)

    like_data = CreationLikeUpdate(likes=creation_db.likes)
    return CreationLikeResponse(data=like_data)


@router.post(
    "/{creation_id}/comments",
    response_model=CommentCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="发表作品评论",
)
async def create_creation_comment(
    creation_id: int, comment_in: CommentCreate, db: AsyncSession = Depends(get_session)
) -> CommentCreateResponse:
    """
    Asynchronously adds a new comment to a specific creation.
    """
    # 开启事务，确保作品评论数和评论记录的一致性
    creation_db = await db.get(Creation, creation_id)
    if not creation_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creation to comment on not found",
        )

    # 创建新的评论对象
    new_comment_db = Comment.model_validate(
        comment_in, update={"creation_id": creation_id}
    )

    # 更新作品的评论数
    creation_db.comments += 1

    db.add(new_comment_db)
    db.add(creation_db)

    await db.commit()

    # 刷新以获取数据库生成的ID和默认值
    await db.refresh(new_comment_db)

    comment_data = CommentRead.model_validate(new_comment_db)
    return CommentCreateResponse(data=comment_data)
