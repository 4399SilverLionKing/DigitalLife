from datetime import datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, ConfigDict


# 使用 Enum 来约束 'type' 字段，提高类型安全性
class CreationType(str, Enum):
    ARTICLE = "article"
    IMAGE = "image"


# 共享的基本字段
class CreationBase(BaseModel):
    title: str
    type: Optional[CreationType] = None
    content: Optional[str] = None
    likes: int = 0
    comments: int = 0
    asset_url: Optional[str] = None


# 创建新记录时使用的模型
class CreationCreate(CreationBase):
    pass


# 更新记录时使用的模型
class CreationUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[CreationType] = None
    content: Optional[str] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    asset_url: Optional[str] = None


# 从数据库读取数据时使用的模型
class Creation(CreationBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
