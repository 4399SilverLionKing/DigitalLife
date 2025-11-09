# File: app/schemas/creation_schema.py

from __future__ import annotations
from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

from app.schemas.common import BaseResponse

# -------------------------------------------------------------
# 1. 核心业务数据结构 (Core Business Schemas)
# -------------------------------------------------------------

# --- Creation Schemas ---


class CreationReadList(SQLModel):
    """Schema for reading a creation's summary data in a list."""

    id: int
    title: str
    asset_url: str


class CreationReadDetail(SQLModel):
    """Schema for reading the full details of a single creation."""

    id: int
    type: str
    title: str
    content: str
    likes: int
    comments: int
    asset_url: str
    created_at: datetime


class CreationLikeUpdate(SQLModel):
    """Schema for the data returned after liking a creation."""

    likes: int


# --- Comment Schemas ---


class CommentCreate(SQLModel):
    """Schema for creating a new comment (request body)."""

    content: str = Field(..., min_length=1, max_length=500)


class CommentRead(SQLModel):
    """Schema for reading a comment's data."""

    id: int
    content: str
    creation_id: int
    reply_content: Optional[str] = None
    created_at: datetime


# -------------------------------------------------------------
# 2. 专用API响应模型 (Dedicated API Response Models)
# -------------------------------------------------------------

# --- Creation API Responses ---


class CreationListResponse(BaseResponse):
    """Dedicated response for fetching a list of creations."""

    data: List[CreationReadList]


class CreationDetailResponse(BaseResponse):
    """Dedicated response for fetching a single creation's details."""

    data: CreationReadDetail


class CreationLikeResponse(BaseResponse):
    """Dedicated response for the like creation action."""

    data: CreationLikeUpdate


# --- Comment API Responses ---


class CommentListResponse(BaseResponse):
    """Dedicated response for fetching a list of comments for a creation."""

    data: List[CommentRead]


class CommentCreateResponse(BaseResponse):
    """Dedicated response after successfully creating a comment."""

    data: CommentRead
