"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";

import type { MoveEntry, MoveQuality } from "../types/chess";

type UseGameReturn = {
  fen: string;
  currentTurn: "w" | "b";
  history: MoveEntry[];
  lastMoveUci: string | null;
  resetGame: () => void;
  applyPlayerMove: (
    sourceSquare: string,
    targetSquare: string,
    evaluation: number,
    quality: MoveQuality
  ) => { uci: string; fen: string } | null;
  applyEngineMove: (moveUci: string, evaluation: number) => string | null;
};

function needsPromotion(sourceSquare: string, targetSquare: string): boolean {
  return (
    (sourceSquare[1] === "7" && targetSquare[1] === "8") ||
    (sourceSquare[1] === "2" && targetSquare[1] === "1")
  );
}

export function useGame(): UseGameReturn {
  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [history, setHistory] = useState<MoveEntry[]>([]);
  const [lastMoveUci, setLastMoveUci] = useState<string | null>(null);

  const currentTurn = useMemo(() => chessRef.current.turn(), [fen]);

  const resetGame = useCallback(() => {
    chessRef.current = new Chess();
    setFen(chessRef.current.fen());
    setHistory([]);
    setLastMoveUci(null);
  }, []);

  const applyPlayerMove = useCallback(
    (
      sourceSquare: string,
      targetSquare: string,
      evaluation: number,
      quality: MoveQuality
    ): { uci: string; fen: string } | null => {
      const promotion = needsPromotion(sourceSquare, targetSquare) ? "q" : undefined;
      const result = chessRef.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion
      });

      if (!result) return null;

      const uci = `${sourceSquare}${targetSquare}${promotion ?? ""}`;
      const nextFen = chessRef.current.fen();
      setFen(nextFen);
      setLastMoveUci(uci);
      setHistory((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${prev.length + 1}`,
          ply: prev.length + 1,
          uci,
          fen: nextFen,
          quality,
          evaluation
        }
      ]);
      return { uci, fen: nextFen };
    },
    []
  );

  const applyEngineMove = useCallback((moveUci: string, evaluation: number): string | null => {
    const from = moveUci.slice(0, 2);
    const to = moveUci.slice(2, 4);
    const promotion = moveUci.length > 4 ? moveUci[4] : undefined;

    const result = chessRef.current.move({
      from,
      to,
      promotion
    });

    if (!result) return null;

    const normalized = `${from}${to}${promotion ?? ""}`;
    const nextFen = chessRef.current.fen();
    setFen(nextFen);
    setLastMoveUci(normalized);
    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length + 1}`,
        ply: prev.length + 1,
        uci: normalized,
        fen: nextFen,
        quality: "best",
        evaluation
      }
    ]);
    return normalized;
  }, []);

  return {
    fen,
    currentTurn,
    history,
    lastMoveUci,
    resetGame,
    applyPlayerMove,
    applyEngineMove
  };
}
