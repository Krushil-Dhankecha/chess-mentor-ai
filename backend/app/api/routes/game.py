from fastapi import APIRouter

router = APIRouter(prefix="/game", tags=["game"])


@router.get("/health")
def game_health() -> dict[str, str]:
    return {"status": "ok"}
