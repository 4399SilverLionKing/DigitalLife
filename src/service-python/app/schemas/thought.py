# File: app/schemas/thought_schema.py

from datetime import datetime
from typing import List

from sqlmodel import SQLModel
from app.schemas.common import BaseResponse


# -------------------------------------------------------------
# 1. 核心业务数据结构 (Core Business Schemas)
# -------------------------------------------------------------


class ThoughtRead(SQLModel):
    """Schema for reading a single thought record."""

    id: int
    cycle_id: int
    agent_name: str
    content: str
    created_at: datetime


# -------------------------------------------------------------
# 2. 专用API响应模型 (Dedicated API Response Models)
# -------------------------------------------------------------


class ThoughtListResponse(BaseResponse):
    """Dedicated response for fetching a list of thoughts."""

    data: List[ThoughtRead]
