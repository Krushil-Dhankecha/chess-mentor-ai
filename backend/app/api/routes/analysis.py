from fastapi import APIRouter, HTTPException

from app.agents.graph import build_analysis_graph
from app.agents.state import AgentState
from app.models.analysis import AnalysisResponse
from app.models.move import MoveRequest
from app.services.game_service import validate_game_input

router = APIRouter(prefix="", tags=["analysis"])


@router.post("/analysis", response_model=AnalysisResponse)
def analyze_move(payload: MoveRequest) -> AnalysisResponse:
    try:
        validate_game_input(payload.fen, payload.move)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    state: AgentState = {
        "fen": payload.fen,
        "user_move": payload.move,
        "best_move": "",
        "evaluation": 0.0,
        "explanation": "",
        "suggestion": "",
        "move_quality": "good",
    }

    try:
        graph = build_analysis_graph()
        result = graph.invoke(state)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=f"Engine failure: {exc}") from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc

    return AnalysisResponse(
        best_move=result["best_move"],
        evaluation=result["evaluation"],
        explanation=result["explanation"],
        suggestion=result["suggestion"],
        move_quality=result["move_quality"],
    )
