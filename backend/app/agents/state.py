from typing import TypedDict


class AgentState(TypedDict):
    fen: str
    user_move: str
    best_move: str
    evaluation: float
    explanation: str
    suggestion: str
    move_quality: str
