"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-[3px] border border-line bg-panel px-3 py-2.5 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M2.8 12S6.1 5.9 12 5.9 21.2 12 21.2 12 17.9 18.1 12 18.1 2.8 12 2.8 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.9" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M6.2 6.8C3.9 8.6 2.8 12 2.8 12s3.3 6.1 9.2 6.1c1.7 0 3.1-.55 4.3-1.3M21.2 12s-3.3-6.1-9.2-6.1c-.9 0-1.72.16-2.46.44"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m4.6 19.4 14.8-14.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.15em] text-faint">
        <label htmlFor="password">Password</label>
        <span className="relative block">
          <input
            id="password"
            className={`${inputClass} pr-10`}
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[3px] p-1.5 text-faint transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </span>
      </div>

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
