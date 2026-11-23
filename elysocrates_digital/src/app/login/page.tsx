import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Dashboard Login — Elysocrates Digital",
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-[1560px] justify-center px-5 py-20 md:px-8 lg:px-10">
      <div className="w-full max-w-sm">
        <p className="text-[11px] uppercase tracking-[0.22em] text-faint">
          Elysocrates Digital
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Studio Dashboard
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Sign in to manage artwork cards and selected works.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
