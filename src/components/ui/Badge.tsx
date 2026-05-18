import type { HTMLAttributes } from "react";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "primary" | "neutral";
};

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  primary: "bg-pertamina-red/10 text-pertamina-red",
  neutral: "bg-slate-100 text-slate-600",
};

export function Badge({
  className = "",
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]} ${className}`}
      {...props}
    />
  );
}
