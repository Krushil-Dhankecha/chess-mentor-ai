from app.agents.state import AgentState
from app.services.evaluation_service import classify_move
from app.services.stockfish_service import StockfishService


def evaluate_node(state: AgentState) -> AgentState:
    stockfish_service = StockfishService()
    best_move, evaluation = stockfish_service.get_best_move_and_evaluation(state["fen"])
    quality = classify_move(state["user_move"], best_move, evaluation)

    state["best_move"] = best_move
    state["evaluation"] = evaluation
    state["move_quality"] = quality
    return state
