# File: app/api/routes/life.py

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import select, desc
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.models import DigitalLife, Comment
from app.schemas.digital_life import (
    CommentCreate,
    CommentCreateResponse,
    CommentListResponse,
    CommentRead,
    LifeStatusRead,
    LifeStatusResponse,
)

router = APIRouter(prefix="/life")


@router.get(
    "/status",
    response_model=LifeStatusResponse,
    summary="获取数字生活状态",
)
async def get_life_status(
    db: AsyncSession = Depends(get_session),
) -> LifeStatusResponse:
    """
    获取当前数字生活的核心状态信息。

    我们假设系统中只有一个或一个主“数字生活”实体，因此总是查询第一个。
    """
    statement = select(DigitalLife)
    result = await db.exec(statement)
    life_status_db = result.first()

    if not life_status_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Digital life status not found.",
        )

    life_status_data = LifeStatusRead.model_validate(life_status_db)
    return LifeStatusResponse(data=life_status_data)


@router.get(
    "/comments",
    response_model=CommentListResponse,
    summary="获取数字生活评论列表",
)
async def get_life_comments(
    page: int = Query(1, ge=1, description="页码，从1开始"),
    page_size: int = Query(10, ge=1, le=100, description="每页数量"),
    db: AsyncSession = Depends(get_session),
) -> CommentListResponse:
    """
    分页获取与数字生活相关的评论列表，按创建时间降序排列。
    """
    offset = (page - 1) * page_size
    statement = (
        select(Comment)
        .offset(offset)
        .limit(page_size)
        .order_by(desc(Comment.created_at))
    )

    result = await db.exec(statement)
    comments_db = result.all()

    comments_data = [CommentRead.model_validate(c) for c in comments_db]
    return CommentListResponse(data=comments_data)


@router.post(
    "/comments",
    response_model=CommentCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="发表数字生活评论",
)
async def create_life_comment(
    comment_in: CommentCreate,
    db: AsyncSession = Depends(get_session),
) -> CommentCreateResponse:
    """
    为当前数字生活添加一条新的评论。
    """
    # 将输入的Schema转换为数据库模型实例
    new_comment_db = Comment.model_validate(comment_in)

    db.add(new_comment_db)
    await db.commit()
    await db.refresh(new_comment_db)

    # 将新创建的数据库对象转换为响应Schema
    created_comment_data = CommentRead.model_validate(new_comment_db)
    return CommentCreateResponse(data=created_comment_data)
