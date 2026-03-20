import type { MoveQuality } from "../types/chess";
import Loader from "./Loader";

type CoachPanelProps = {
  explanation: string;
  bestMove: string;
  quality: MoveQuality;
  loading: boolean;
  error?: string | null;
};

function qualityBadgeClass(quality: MoveQuality): string {
  switch (quality) {
    case "best":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    case "good":
      return "bg-sky-500/20 text-sky-300 border-sky-500/40";
    case "inaccuracy":
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    case "mistake":
      return "bg-orange-500/20 text-orange-300 border-orange-500/40";
    case "blunder":
      return "bg-red-500/20 text-red-300 border-red-500/40";
    default:
      return "bg-zinc-700/20 text-zinc-200 border-zinc-600";
  }
}

export default function CoachPanel({ explanation, bestMove, quality, loading, error }: CoachPanelProps) {
  return (
    <section className="panel min-h-[16rem] w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Coach Panel</h2>
        <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase ${qualityBadgeClass(quality)}`}>
          {quality}
        </span>
      </div>

      {loading ? (
        <Loader label="Analyzing your move..." />
      ) : (
        <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">AI Coach</p>
            <p>{explanation || "Make a move to get personalized coaching."}</p>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Suggested Best Move</p>
            <p className="font-mono text-base text-cyan-300">{bestMove || "--"}</p>
          </div>
          {error ? (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</div>
          ) : null}
        </div>
      )}
    </section>
  );
}
