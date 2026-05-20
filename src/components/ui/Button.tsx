import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
};

const baseStyles =
  "inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:brightness-95 focus-visible:outline-[var(--primary)]",
  secondary:
    "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-slate-300",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-300",
  outline:
    "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-300",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
  lg: "px-8 py-3 text-base",
  icon: "h-10 w-10 p-2",
};

export function Button({
  className = "",
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
}
