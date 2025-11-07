from pydantic import BaseModel


class BaseResponse(BaseModel):
    code: int = 0
    message: str = "Success"
