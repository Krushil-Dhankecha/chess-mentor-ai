"use client";

import { useCallback, useMemo, useState } from "react";

import ChessBoard from "../components/ChessBoard";
import CoachPanel from "../components/CoachPanel";
import EvaluationBar from "../components/EvaluationBar";
import MoveList from "../components/MoveList";
import { useAnalysis } from "../hooks/useAnalysis";
import { useGame } from "../hooks/useGame";
import type { MoveQuality } from "../types/chess";

function getMoveQuality(evaluation: number): MoveQuality {
  const absEval = Math.abs(evaluation);
  if (absEval < 1.0) return "best";
  if (absEval < 2.0) return "good";
  if (absEval < 4.0) return "inaccuracy";
  if (absEval < 6.0) return "mistake";
  return "blunder";
}

export default function HomePage() {
  const { fen, history, lastMoveUci, resetGame, applyPlayerMove, applyEngineMove } = useGame();
  const { loading, error, runAnalysis, clearError } = useAnalysis();

  const [evaluation, setEvaluation] = useState(0);
  const [explanation, setExplanation] = useState("Welcome to ChessMentor AI. Make your first move.");
  const [bestMove, setBestMove] = useState("");
  const [quality, setQuality] = useState<MoveQuality>("good");

  const handleMove = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      if (loading) return false;
      clearError();

      const optimisticQuality = getMoveQuality(evaluation);
      const playerMove = applyPlayerMove(sourceSquare, targetSquare, evaluation, optimisticQuality);
      if (!playerMove) return false;

      void (async () => {
        const analysis = await runAnalysis(playerMove.fen, playerMove.uci);
        if (!analysis) return;

        setEvaluation(analysis.evaluation);
        setExplanation(analysis.explanation);
        setBestMove(analysis.best_move);

        const computedQuality = getMoveQuality(analysis.evaluation);
        setQuality(computedQuality);

        if (analysis.best_move && analysis.best_move !== playerMove.uci) {
          applyEngineMove(analysis.best_move, analysis.evaluation);
        }
      })();

      return true;
    },
    [applyEngineMove, applyPlayerMove, clearError, evaluation, loading, runAnalysis]
  );

  const handleReset = useCallback(() => {
    resetGame();
    setEvaluation(0);
    setExplanation("Game reset. Play a move to start receiving coaching.");
    setBestMove("");
    setQuality("good");
    clearError();
  }, [clearError, resetGame]);

  const latestQuality = useMemo(() => (history.length ? history[history.length - 1].quality : quality), [history, quality]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">ChessMentor AI</h1>
          <p className="text-sm text-zinc-400">Play, analyze, and improve with real-time AI coaching.</p>
        </div>
        <button
          onClick={handleReset}
          className="rounded-md border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-cyan-400 hover:text-cyan-300"
        >
          Reset Game
        </button>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <ChessBoard fen={fen} onMove={handleMove} disabled={loading} bestMove={bestMove} />
        </div>

        <aside className="grid grid-cols-[auto_1fr] gap-4">
          <EvaluationBar evaluation={evaluation} />
          <div className="flex min-h-[42rem] flex-col gap-4">
            <CoachPanel explanation={explanation} bestMove={bestMove} quality={latestQuality} loading={loading} error={error} />
            <MoveList moves={history} />
            <div className="panel text-xs text-zinc-400">
              Latest move: <span className="font-mono text-zinc-200">{lastMoveUci ?? "--"}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
