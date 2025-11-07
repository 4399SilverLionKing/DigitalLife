from typing import Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# 共享的基本字段
# 对于 thought 这种日志型数据，Create 和 Base 通常是相同的
class ThoughtBase(BaseModel):
    cycle_id: Optional[int] = None
    agent_name: Optional[str] = None
    content: Optional[str] = None


# 创建新记录时使用的模型
class ThoughtCreate(ThoughtBase):
    pass


# 更新 thought 可能不太常见，但为了一致性提供
class ThoughtUpdate(BaseModel):
    cycle_id: Optional[int] = None
    agent_name: Optional[str] = None
    message: Optional[str] = None


# 从数据库读取数据时使用的模型
class Thought(ThoughtBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
