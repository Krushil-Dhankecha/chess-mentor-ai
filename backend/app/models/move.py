from pydantic import BaseModel, Field


class MoveRequest(BaseModel):
    fen: str = Field(..., description="Current board FEN")
    move: str = Field(..., description="User move in UCI format, e.g. e2e4")
