export type MoveQuality = "best" | "good" | "inaccuracy" | "mistake" | "blunder";

export type AnalysisRequest = {
  fen: string;
  move: string;
};

export type AnalysisResponse = {
  best_move: string;
  evaluation: number;
  explanation: string;
};

export type MoveEntry = {
  id: string;
  ply: number;
  uci: string;
  fen: string;
  quality: MoveQuality;
  evaluation: number;
};

export type CoachInsight = {
  explanation: string;
  bestMove: string;
  quality: MoveQuality;
};
