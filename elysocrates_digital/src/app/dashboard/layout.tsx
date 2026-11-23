import type { Metadata } from "next";
import Link from "next/link";

import { LogoutButton } from "@/components/dashboard/logout-button";

export const metadata: Metadata = {
  title: "Content Dashboard — Elysocrates Digital",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-faint">
            Elysocrates Digital
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Content Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.15em]">
          <Link
            href="/"
            className="rounded-[3px] border border-line px-3 py-2 text-muted transition-colors hover:text-white"
          >
            View site
          </Link>
          <LogoutButton />
        </div>
      </header>
      <div className="py-8">{children}</div>
    </div>
  );
}
