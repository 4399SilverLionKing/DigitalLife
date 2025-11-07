from fastapi import APIRouter

from app.api.routes import creation_route, life_route, thought_route

api_router = APIRouter(prefix="/api")

api_router.include_router(life_route.router)
api_router.include_router(creation_route.router)
api_router.include_router(thought_route.router)
