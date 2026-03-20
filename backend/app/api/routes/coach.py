from fastapi import APIRouter

router = APIRouter(prefix="/coach", tags=["coach"])


@router.get("/health")
def coach_health() -> dict[str, str]:
    return {"status": "ok"}
