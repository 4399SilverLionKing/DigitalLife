from datetime import datetime
from typing import Optional, List, Any

from pydantic import BaseModel, ConfigDict


# 共享的基本字段
class ToolBase(BaseModel):
    name: str
    description: Optional[str] = None
    code: Optional[str] = None
    dependencies: Optional[List[Any]] = None  # JSONB 可以映射为列表或字典


# 创建新记录时使用的模型
class ToolCreate(ToolBase):
    pass


# 更新记录时使用的模型
class ToolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    code: Optional[str] = None
    dependencies: Optional[List[Any]] = None


# 从数据库读取数据时使用的模型
class Tool(ToolBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
