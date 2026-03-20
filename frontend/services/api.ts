import type { AnalysisRequest, AnalysisResponse } from "../types/chess";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function analyzeMove(fen: string, move: string): Promise<AnalysisResponse> {
  const payload: AnalysisRequest = { fen, move };
  const response = await fetch(`${API_BASE_URL}/analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "Unknown server error");
    throw new Error(`Analysis request failed (${response.status}): ${details}`);
  }

  const data = (await response.json()) as AnalysisResponse;
  return data;
}
