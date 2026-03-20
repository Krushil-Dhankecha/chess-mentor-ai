from pydantic import BaseModel, Field


class AnalysisResponse(BaseModel):
    best_move: str = Field(..., description="Engine best move in UCI")
    evaluation: float = Field(..., description="Evaluation score in pawns from white perspective")
    explanation: str = Field(..., description="Coach explanation")
    suggestion: str = Field(..., description="Suggestion for better plan or move")
    move_quality: str = Field(..., description="Move classification")
