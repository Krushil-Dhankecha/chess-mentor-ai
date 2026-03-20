from pathlib import Path

from app.integrations.langchain_setup import build_text_chain

PROMPTS_DIR = Path(__file__).resolve().parents[1] / "prompts"
COACH_PROMPT_PATH = PROMPTS_DIR / "coach_prompt.txt"
BLUNDER_PROMPT_PATH = PROMPTS_DIR / "blunder_prompt.txt"


class CoachService:
    def __init__(self) -> None:
        self.coach_prompt = COACH_PROMPT_PATH.read_text(encoding="utf-8")
        self.blunder_prompt = BLUNDER_PROMPT_PATH.read_text(encoding="utf-8")

    def explain_move(self, fen: str, user_move: str, best_move: str, evaluation: float, move_quality: str) -> str:
        context = (
            f"FEN: {fen}\n"
            f"Player move: {user_move}\n"
            f"Engine best move: {best_move}\n"
            f"Evaluation: {evaluation:+.2f}\n"
            f"Move quality: {move_quality}\n"
            "Explain briefly and clearly for intermediate players."
        )
        prompt = self.blunder_prompt if move_quality in {"mistake", "blunder"} else self.coach_prompt
        try:
            chain = build_text_chain(prompt)
            result = chain.invoke({"input_text": context})
            return result.strip()
        except Exception:  # noqa: BLE001
            return (
                f"Your move {user_move} is classified as {move_quality}. "
                f"The engine prefers {best_move}. Focus on center control, king safety, and development."
            )

    def suggest_better_plan(self, best_move: str, move_quality: str) -> str:
        if move_quality == "excellent":
            return f"Excellent move. Keep the initiative and continue with accurate play; {best_move} is still strong in this position."
        if move_quality in {"mistake", "blunder"}:
            return f"Consider {best_move} next time to avoid tactical losses and improve king safety."
        return f"A stronger continuation is {best_move}. Prioritize piece activity and central control."
