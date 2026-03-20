type LoaderProps = {
  label?: string;
};

export default function Loader({ label = "Thinking..." }: LoaderProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2">
      <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
      <span className="text-sm text-zinc-300">{label}</span>
    </div>
  );
}
