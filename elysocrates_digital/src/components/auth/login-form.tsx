"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-[3px] border border-line bg-panel px-3 py-2.5 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (response.ok) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    setError(data?.error ?? "Sign in failed");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.15em] text-faint">
        Email
        <input
          className={inputClass}
          type="email"
          name="email"
          autoComplete="username"
          required
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.15em] text-faint">
        Password
        <input
          className={inputClass}
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-[3px] border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-[3px] bg-accent px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
