export type ProgressBarProps = {
  value: number;
  max: number;
};

export default function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const barColor = percent > 80 ? "bg-pertamina-red" : "bg-sky-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{value} L</span>
        <span>{max} L</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">
        {value} / {max} L
      </p>
    </div>
  );
}
