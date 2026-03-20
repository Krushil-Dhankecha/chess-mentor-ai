"use client";

import { useCallback, useState } from "react";

import { analyzeMove } from "../services/api";
import type { AnalysisResponse } from "../types/chess";

type UseAnalysisReturn = {
  loading: boolean;
  error: string | null;
  runAnalysis: (fen: string, move: string) => Promise<AnalysisResponse | null>;
  clearError: () => void;
};

export function useAnalysis(): UseAnalysisReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (fen: string, move: string): Promise<AnalysisResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      return await analyzeMove(fen, move);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze move";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, runAnalysis, clearError };
}
