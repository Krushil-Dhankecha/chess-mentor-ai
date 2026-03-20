from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.analysis import router as analysis_router
from app.api.routes.coach import router as coach_router
from app.api.routes.game import router as game_router
from app.core.config import settings

app = FastAPI(title=settings.app_name, version=settings.app_version, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game_router)
app.include_router(coach_router)
app.include_router(analysis_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "ChessMentor AI backend is running"}
