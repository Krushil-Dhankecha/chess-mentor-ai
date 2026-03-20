from app.core.constants import (
    MOVE_QUALITY_BLUNDER,
    MOVE_QUALITY_EXCELLENT,
    MOVE_QUALITY_GOOD,
    MOVE_QUALITY_INACCURACY,
    MOVE_QUALITY_MISTAKE,
)


def classify_move(user_move: str, best_move: str, evaluation: float) -> str:
    if user_move == best_move:
        return MOVE_QUALITY_EXCELLENT

    abs_eval = abs(evaluation)
    if abs_eval <= 1.0:
        return MOVE_QUALITY_GOOD
    if abs_eval <= 2.5:
        return MOVE_QUALITY_INACCURACY
    if abs_eval <= 4.5:
        return MOVE_QUALITY_MISTAKE
    return MOVE_QUALITY_BLUNDER
