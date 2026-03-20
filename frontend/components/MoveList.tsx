import type { MoveEntry } from "../types/chess";

type MoveListProps = {
  moves: MoveEntry[];
};

function qualityClass(quality: MoveEntry["quality"]): string {
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
      return "bg-zinc-700/40 text-zinc-200 border-zinc-600";
  }
}

export default function MoveList({ moves }: MoveListProps) {
  return (
    <section className="panel h-[17rem] w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">Move List</h2>
        <span className="text-xs text-zinc-400">{moves.length} plies</span>
      </div>

      {moves.length === 0 ? (
        <p className="text-sm text-zinc-400">No moves yet. Start by making a move on the board.</p>
      ) : (
        <ol className="scrollbar-thin flex max-h-[13rem] flex-col gap-2 overflow-y-auto pr-1">
          {moves.map((move, index) => {
            const isLatest = index === moves.length - 1;
            return (
              <li
                key={move.id}
                className={`flex items-center justify-between rounded-md border px-3 py-2 transition ${
                  isLatest ? "border-cyan-500/60 bg-cyan-500/10" : "border-zinc-700 bg-zinc-900/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">#{move.ply}</span>
                  <span className="font-mono text-sm text-zinc-100">{move.uci}</span>
                </div>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${qualityClass(move.quality)}`}>
                  {move.quality}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
