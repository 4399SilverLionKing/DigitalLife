from typing import Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# 共享的基本字段
class CommentBase(BaseModel):
    content: str
    reply_content: Optional[str] = None

    # 外键字段
    creation_id: Optional[int] = None


# 创建新记录时使用的模型
class CommentCreate(CommentBase):
    pass


# 更新记录时使用的模型
class CommentUpdate(BaseModel):
    content: Optional[str] = None
    reply_content: Optional[str] = None


# 从数据库读取数据时使用的模型
class Comment(CommentBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
