from app.agents.state import AgentState
from app.services.coach_service import CoachService


def suggest_node(state: AgentState) -> AgentState:
    coach_service = CoachService()
    state["suggestion"] = coach_service.suggest_better_plan(
        best_move=state["best_move"],
        move_quality=state["move_quality"],
    )
    return state
