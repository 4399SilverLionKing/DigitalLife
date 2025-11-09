# File: app/schemas/life_schema.py

from datetime import datetime
from typing import List, Optional

from sqlmodel import SQLModel
from app.schemas.common import BaseResponse


# -------------------------------------------------------------
# 1. 核心业务数据结构 (Core Business Schemas)
# -------------------------------------------------------------


class LifeStatusRead(SQLModel):
    """Schema for reading the digital life status."""

    id: int
    name: str
    likes: int
    visitors: int
    comments: int
    lifespan: datetime
    created_at: datetime
    tools: int
    creations: int


class CommentRead(SQLModel):
    """Schema for reading a single comment."""

    id: int
    content: str
    reply_content: Optional[str] = None
    created_at: datetime


class CommentCreate(SQLModel):
    """Schema for creating a new comment."""

    content: str


# -------------------------------------------------------------
# 2. 专用API响应模型 (Dedicated API Response Models)
# -------------------------------------------------------------


class LifeStatusResponse(BaseResponse):
    """Dedicated response for fetching the digital life status."""

    data: LifeStatusRead


class CommentListResponse(BaseResponse):
    """Dedicated response for fetching a list of comments."""

    data: List[CommentRead]


class CommentCreateResponse(BaseResponse):
    """Dedicated response after creating a new comment."""

    data: CommentRead
