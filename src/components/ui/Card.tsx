import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: CardProps) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: CardProps) {
  return (
    <h3 className={`text-base font-semibold text-slate-800 ${className}`} {...props} />
  );
}

export function CardDescription({ className = "", ...props }: CardProps) {
  return (
    <p className={`text-sm text-slate-500 ${className}`} {...props} />
  );
}
