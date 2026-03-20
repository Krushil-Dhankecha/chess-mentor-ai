from app.agents.state import AgentState
from app.services.coach_service import CoachService


def explain_node(state: AgentState) -> AgentState:
    coach_service = CoachService()
    state["explanation"] = coach_service.explain_move(
        fen=state["fen"],
        user_move=state["user_move"],
        best_move=state["best_move"],
        evaluation=state["evaluation"],
        move_quality=state["move_quality"],
    )
    return state
