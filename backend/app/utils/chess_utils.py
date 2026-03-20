import chess


def validate_fen(fen: str) -> None:
    try:
        chess.Board(fen)
    except ValueError as exc:
        raise ValueError("Invalid FEN provided.") from exc


def validate_uci_move(fen: str, uci_move: str) -> chess.Move:
    board = chess.Board(fen)
    try:
        move = chess.Move.from_uci(uci_move)
    except ValueError as exc:
        raise ValueError("Invalid move format. Expected UCI move like e2e4.") from exc
    if move not in board.legal_moves:
        raise ValueError("Illegal move for the given position.")
    return move


def apply_move(fen: str, uci_move: str) -> str:
    board = chess.Board(fen)
    move = chess.Move.from_uci(uci_move)
    board.push(move)
    return board.fen()
