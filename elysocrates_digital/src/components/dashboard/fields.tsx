import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-[3px] border border-line bg-ink px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none";

export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.15em] text-faint ${className ?? ""}`}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}
