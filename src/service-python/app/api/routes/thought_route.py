# File: app/api/routes/thought_router.py

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlmodel import select, desc
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.models import Thought  # 假设 Thought 模型定义在 app/models.py
from app.schemas.thought import ThoughtRead, ThoughtListResponse

router = APIRouter(tags=["Thoughts"])


@router.get(
    "/thoughts",
    response_model=ThoughtListResponse,
    summary="获取思考列表",
    description="分页获取所有的思考记录，默认按创建时间倒序排列。",
)
async def get_thoughts_list(
    db: AsyncSession = Depends(get_session),
    page: int = Query(1, ge=1, description="页码，从1开始"),
    page_size: int = Query(
        10, ge=1, le=100, description="每页数量，默认为10，最大为100"
    ),
) -> ThoughtListResponse:
    """
    Asynchronously retrieves a paginated list of thought records from the database.
    """
    # 1. 计算分页偏移量
    offset = (page - 1) * page_size

    # 2. 构建异步数据库查询语句
    # 按创建时间倒序获取最新的记录
    statement = (
        select(Thought)
        .order_by(desc(Thought.created_at))
        .offset(offset)
        .limit(page_size)
    )

    # 3. 异步执行查询
    results = await db.exec(statement)
    db_thoughts = results.all()

    # 4. 将数据库模型转换为Pydantic响应模型
    # 这是关键要求，确保输出格式与API定义一致，并剥离不必要的字段
    thoughts_data = [ThoughtRead.model_validate(t) for t in db_thoughts]

    # 5. 使用专用的响应模型封装并返回结果
    return ThoughtListResponse(data=thoughts_data)
