from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlmodel import select, col, desc
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session

# 导入 Pydantic Schemas 用于 API 交互
from app.schemas.comment import Comment as CommentSchema
from app.schemas.digital_life import DigitalLife as DigitalLifeSchema
from app.schemas.base_response import BaseResponse

# 导入数据库模型 (DB Models) 用于数据库操作
from app.models import Comment as DBComment
from app.models import DigitalLife as DBDigitalLife

router = APIRouter(prefix="/life", tags=["life"])


# API 响应模型
class LifeStatusResponse(BaseResponse):
    data: DigitalLifeSchema


class CommentListResponse(BaseResponse):
    data: List[CommentSchema]


class CommentCreateRequest(BaseModel):
    content: str = Field(..., min_length=1, description="Comment content")


class CommentCreateResponse(BaseResponse):
    message: str = "Comment created successfully"
    data: CommentSchema


@router.get("/status", response_model=LifeStatusResponse)
async def get_life_status(
    session: AsyncSession = Depends(get_session),
) -> LifeStatusResponse:
    """Return the first digital life record."""
    statement = select(DBDigitalLife).order_by(col(DBDigitalLife.id))
    result = await session.exec(statement)
    digital_life = result.first()

    if not digital_life:
        raise HTTPException(status_code=404, detail="Digital life not found")

    return LifeStatusResponse(data=DigitalLifeSchema.model_validate(digital_life))


@router.get("/comments", response_model=CommentListResponse)
async def list_life_comments(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=50, description="Page size"),
    session: AsyncSession = Depends(get_session),
) -> CommentListResponse:
    """Return paginated global comments about the digital life entity."""
    offset = (page - 1) * limit

    # 使用 ORM 构建分页和过滤查询
    statement = (
        select(DBComment)
        .where(DBComment.creation_id == None)
        .order_by(desc(DBComment.created_at))
        .offset(offset)
        .limit(limit)
    )
    result = await session.exec(statement)
    comments_db = result.all()  # 获取所有结果

    # 将数据库模型列表转换为 Schema 列表
    comments_schema = [CommentSchema.model_validate(c) for c in comments_db]

    return CommentListResponse(data=comments_schema)


@router.post("/comments", response_model=CommentCreateResponse)
async def create_life_comment(
    payload: CommentCreateRequest,
    session: AsyncSession = Depends(get_session),
) -> CommentCreateResponse:
    """Create a global comment for the digital life entity."""

    # 1. 查询 DigitalLife 对象e
    life_statement = select(DBDigitalLife).order_by(col(DBDigitalLife.id))
    life_result = await session.exec(life_statement)
    life = life_result.first()
    if not life:
        raise HTTPException(
            status_code=404, detail="Digital life to comment on not found"
        )

    # 2. 创建一个新的 Comment 数据库模型实例
    db_comment = DBComment(content=payload.content)

    # 3. 原子地更新评论计数
    life.comments += 1

    # 4. 将新对象和更新后的对象添加到会话中
    session.add(db_comment)
    session.add(life)

    # 5. 提交事务，将所有更改一次性写入数据库
    await session.commit()

    # 6. 刷新新创建的评论对象，以获取数据库生成的 id 和 created_at
    await session.refresh(db_comment)

    # 7. 返回新创建的评论数据
    return CommentCreateResponse(data=CommentSchema.model_validate(db_comment))
