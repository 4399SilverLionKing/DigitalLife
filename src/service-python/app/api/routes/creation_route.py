from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)

router = APIRouter()
