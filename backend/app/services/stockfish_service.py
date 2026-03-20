from __future__ import annotations

import chess
import chess.engine

from app.core.config import settings


class StockfishService:
    def __init__(self) -> None:
        self._engine_path = settings.stockfish_path

    def _analyze(self, fen: str) -> tuple[str, float]:
        board = chess.Board(fen)
        try:
            with chess.engine.SimpleEngine.popen_uci(self._engine_path) as engine:
                info = engine.analyse(
                    board,
                    chess.engine.Limit(depth=settings.analysis_depth, time=settings.analysis_time_limit_ms / 1000.0),
                )
                best_move = info.get("pv", [None])[0]
                score = info["score"].white()
        except FileNotFoundError as exc:
            raise RuntimeError(f"Stockfish binary not found at: {self._engine_path}") from exc
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(f"Stockfish analysis failed: {exc}") from exc

        if best_move is None:
            raise RuntimeError("Engine did not provide a best move.")

        cp_score = score.score(mate_score=100000)
        if cp_score is None:
            cp_score = 0
        evaluation = max(-10.0, min(10.0, cp_score / 100.0))
        return best_move.uci(), evaluation

    def get_best_move_and_evaluation(self, fen: str) -> tuple[str, float]:
        return self._analyze(fen)
