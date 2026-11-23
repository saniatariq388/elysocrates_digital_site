import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label="Elysocrates Digital — home"
    >
      <span
        aria-hidden
        className="flex h-11 w-11 items-center justify-center bg-accent text-[22px] font-black leading-none tracking-tighter text-ink"
      >
        ED
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold tracking-[0.34em] text-fg transition-colors group-hover:text-accent">
          ELYSOCRATES
        </span>
        <span className="mt-[5px] text-[9px] tracking-[0.44em] text-muted">
          DIGITAL
        </span>
      </span>
    </Link>
  );
}
