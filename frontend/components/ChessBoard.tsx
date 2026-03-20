"use client";

import { useMemo } from "react";
import { Chessboard } from "react-chessboard";

type ChessBoardProps = {
  fen: string;
  onMove: (sourceSquare: string, targetSquare: string) => boolean;
  disabled?: boolean;
  bestMove?: string;
};

export default function ChessBoard({ fen, onMove, disabled = false, bestMove }: ChessBoardProps) {
  const highlightedSquares = useMemo(() => {
    if (!bestMove || bestMove.length < 4) return {};
    const from = bestMove.slice(0, 2);
    const to = bestMove.slice(2, 4);
    return {
      [from]: { background: "radial-gradient(circle, rgba(34, 211, 238, 0.25) 40%, transparent 40%)" },
      [to]: { backgroundColor: "rgba(34, 211, 238, 0.25)" }
    };
  }, [bestMove]);

  return (
    <section className="panel w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">Game Board</h2>
        <span className="text-xs text-zinc-400">{disabled ? "Board locked" : "Your move"}</span>
      </div>
      <div className={`transition-opacity duration-200 ${disabled ? "opacity-60" : "opacity-100"}`}>
        <Chessboard
          id="chessmentor-board"
          position={fen}
          arePiecesDraggable={!disabled}
          onPieceDrop={onMove}
          customDarkSquareStyle={{ backgroundColor: "#334155" }}
          customLightSquareStyle={{ backgroundColor: "#cbd5e1" }}
          customBoardStyle={{ borderRadius: "0.75rem", overflow: "hidden" }}
          customSquareStyles={highlightedSquares}
          animationDuration={180}
        />
      </div>
    </section>
  );
}
