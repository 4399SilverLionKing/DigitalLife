import datetime
from typing import List, Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel


# ------------------------------------------------------------------
# Model for: digital_life
# 存储关于每个数字生命实体的信息
# ------------------------------------------------------------------
class DigitalLife(SQLModel, table=True):

    __tablename__ = "digital_life"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    likes: int = Field(default=0)
    visitors: int = Field(default=0)
    comments: int = Field(default=0)
    # 对应 TIMESTAMPTZ，可以为 NULL，所以使用 Optional
    lifespan: Optional[datetime.datetime] = Field(default=None)
    # 对应 DEFAULT now()，使用 default_factory 在创建对象时生成时间
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)


# ------------------------------------------------------------------
# Model for: tools
# 存储可供智能体使用的工具信息
# ------------------------------------------------------------------
class Tool(SQLModel, table=True):

    __tablename__ = "tools"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    description: Optional[str] = Field(default=None)
    code: Optional[str] = Field(default=None)
    # 对应 JSONB 类型，需要使用 sa_column 来指定数据库特定类型
    # Python 侧的类型可以是 List, Dict 等
    dependencies: Optional[List[str]] = Field(default=None, sa_column=Column(JSONB))
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)


# ------------------------------------------------------------------
# Model for: thoughts
# 记录智能体的思考过程
# ------------------------------------------------------------------
class Thought(SQLModel, table=True):

    __tablename__ = "thoughts"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    cycle_id: Optional[int] = Field(default=None)
    agent_name: Optional[str] = Field(default=None)
    content: Optional[str] = Field(default=None)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)


# ------------------------------------------------------------------
# Models with Relationships: creations and comments
# ------------------------------------------------------------------


# Forward declaration for type hinting in relationships
class Creation(SQLModel, table=True):

    __tablename__ = "creations"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    type: Optional[str] = Field(default=None)
    title: str
    content: Optional[str] = Field(default=None)
    likes: int = Field(default=0)
    comments: int = Field(default=0)
    asset_url: Optional[str] = Field(default=None)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)

    # --- Relationship ---
    # 一个 Creation 可以有多个 Comment
    # "Comment" 使用字符串形式避免循环导入问题
    # back_populates="creation" 指明了在 Comment 模型中，哪个属性反向链接回这里
    comments_list: List["Comment"] = Relationship(back_populates="creation")


class Comment(SQLModel, table=True):

    __tablename__ = "comments"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    # 对应 reply_content TEXT
    reply_content: Optional[str] = Field(default=None)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)

    # --- Foreign Key and Relationship ---
    # 对应 creation_id BIGINT, 关联到 creations 表的 id
    # ondelete="CASCADE" 可以在 ORM 层面模拟 ON DELETE CASCADE 行为
    creation_id: Optional[int] = Field(default=None, foreign_key="creations.id")

    # 一个 Comment 属于一个 Creation
    # back_populates="comments_list" 指明了在 Creation 模型中，哪个属性反向链接回这里
    creation: Optional[Creation] = Relationship(back_populates="comments_list")
