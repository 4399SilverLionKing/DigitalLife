# File: app/schemas/common.py
from pydantic import BaseModel


class BaseResponse(BaseModel):
    """
    基础响应模型，data 字段类型为 Any。
    """

    code: int = 0
    message: str = "Success"
