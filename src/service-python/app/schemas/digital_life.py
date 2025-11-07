from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# 共享的基本字段
class DigitalLifeBase(BaseModel):
    name: str
    likes: int = 0
    visitors: int = 0
    comments: int = 0
    lifespan: Optional[datetime] = None


# 创建新记录时使用的模型 (不需要 id 和 created_at)
class DigitalLifeCreate(DigitalLifeBase):
    pass


# 更新记录时使用的模型 (所有字段都可选)
class DigitalLifeUpdate(BaseModel):
    name: Optional[str] = None
    likes: Optional[int] = None
    visitors: Optional[int] = None
    comments: Optional[int] = None
    lifespan: Optional[datetime] = None


# 从数据库读取数据时使用的模型 (包含所有字段)
class DigitalLife(DigitalLifeBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
