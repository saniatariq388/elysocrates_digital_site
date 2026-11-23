"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleLogout() {
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error(`Logout failed: ${response.status}`);
      router.replace("/login");
      router.refresh();
    } catch {
      setFailed(true);
      setPending(false);
    }
  }

  return (
    <span className="flex items-center gap-3">
      {failed && (
        <span role="alert" className="normal-case tracking-normal text-red-300">
          Sign out failed
        </span>
      )}
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className="rounded-[3px] border border-line bg-panel px-3 py-2 text-muted transition-colors hover:text-white disabled:opacity-50"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
    </span>
  );
}
