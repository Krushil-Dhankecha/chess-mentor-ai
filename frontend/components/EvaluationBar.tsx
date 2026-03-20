type EvaluationBarProps = {
  evaluation: number;
};

const MIN_EVAL = -10;
const MAX_EVAL = 10;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function EvaluationBar({ evaluation }: EvaluationBarProps) {
  const clamped = clamp(evaluation, MIN_EVAL, MAX_EVAL);
  const percentage = ((clamped - MIN_EVAL) / (MAX_EVAL - MIN_EVAL)) * 100;

  return (
    <div className="flex h-[22rem] w-14 flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Eval</p>
      <div className="relative h-full w-6 overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
        <div
          className="absolute left-0 w-full bg-white transition-all duration-300"
          style={{ height: `${percentage}%`, bottom: 0 }}
        />
        <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-700" />
      </div>
      <p className="text-xs font-semibold text-zinc-300">{clamped > 0 ? `+${clamped.toFixed(1)}` : clamped.toFixed(1)}</p>
    </div>
  );
}
