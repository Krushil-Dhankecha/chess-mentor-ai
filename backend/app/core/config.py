from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ChessMentor AI Backend"
    app_version: str = "1.0.0"
    debug: bool = False

    groq_api_key: str | None = None
    groq_model: str = "llama-3.1-8b-instant"

    analysis_depth: int = 14
    analysis_time_limit_ms: int = 350

    stockfish_path: str = str((Path(__file__).resolve().parents[3] / "engine" / "stockfish").resolve())

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
