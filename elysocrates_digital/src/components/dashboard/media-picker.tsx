"use client";

import { useState } from "react";

import { adminFetch, type MediaRecord } from "@/lib/content-admin";

export function MediaPicker({
  onSelect,
}: {
  onSelect: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    if (!open && items === null) {
      adminFetch<MediaRecord[]>("media")
        .then((data) => setItems(data))
        .catch((cause) =>
          setError(
            cause instanceof Error ? cause.message : "Could not load media",
          ),
        );
    }
    setOpen((current) => !current);
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={toggle}
        className="rounded-[3px] border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-white"
      >
        {open ? "Close library" : "Choose from media"}
      </button>

      {open && (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-[3px] border border-line bg-ink p-3">
          {error && <p className="text-xs text-red-300">{error}</p>}
          {items === null && !error && (
            <p className="text-xs text-faint">Loading media…</p>
          )}
          {items !== null && items.length === 0 && (
            <p className="text-xs text-faint">
              Nothing uploaded yet. Use the Media tab to upload an image.
            </p>
          )}
          {items !== null && items.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.url);
                    setOpen(false);
                  }}
                  className="group overflow-hidden rounded-[2px] border border-line text-left transition-colors hover:border-accent"
                  title={item.alt || item.path}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
