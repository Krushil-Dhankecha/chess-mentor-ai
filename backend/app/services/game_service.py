from app.utils.chess_utils import validate_fen, validate_uci_move


def validate_game_input(fen: str, move: str) -> None:
    validate_fen(fen)
    validate_uci_move(fen, move)
