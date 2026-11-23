"use client";

import { useEffect } from "react";

export function Toast({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 rounded-[3px] border border-accent/40 bg-panel px-4 py-3 text-sm text-fg shadow-xl"
    >
      {message}
    </div>
  );
}
