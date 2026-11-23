"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { Field, inputClass } from "@/components/dashboard/fields";
import { Toast } from "@/components/dashboard/toast";
import {
  adminFetch,
  adminUpload,
  type MediaRecord,
} from "@/lib/content-admin";

export function MediaManager() {
  const router = useRouter();
  const [items, setItems] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState("");
  const [editingAltId, setEditingAltId] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const copyTimer = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await adminFetch<MediaRecord[]>("media");
      setItems(data);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminFetch<MediaRecord[]>("media")
      .then((data) => {
        if (!active) return;
        setItems(data);
        setLoading(false);
      })
      .catch((cause) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not load media");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image file first.");
      return;
    }

    setUploading(true);
    setError(null);
    setNotice(null);
    const form = new FormData();
    form.append("file", file);
    form.append("alt", alt);

    try {
      await adminUpload<MediaRecord>("media", form);
      setAlt("");
      if (fileRef.current) fileRef.current.value = "";
      await load();
      setNotice("Image uploaded.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleCopy(item: MediaRecord) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setError("Could not copy the URL. Open it and copy from the address bar.");
    }
  }

  function startAltEdit(item: MediaRecord) {
    setEditingAltId(item.id);
    setAltDraft(item.alt);
  }

  async function saveAlt(item: MediaRecord) {
    setError(null);
    try {
      const updated = await adminFetch<MediaRecord>(`media/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ alt: altDraft }),
      });
      setItems((current) =>
        current.map((row) => (row.id === item.id ? updated : row)),
      );
      setEditingAltId(null);
      setNotice("Alt text saved.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save alt text");
    }
  }

  async function handleDelete(item: MediaRecord) {
    if (
      !window.confirm(
        `Delete “${item.alt || item.path}”? The file is removed from Storage too.`,
      )
    ) {
      return;
    }
    setError(null);
    try {
      await adminFetch<undefined>(`media/${item.id}`, { method: "DELETE" });
      if (editingAltId === item.id) setEditingAltId(null);
      await load();
      setNotice("Image deleted.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete image");
    }
  }

  return (
    <div>
      <Toast message={notice} onDismiss={() => setNotice(null)} />
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Media library</h2>
        <p className="mt-1 text-sm text-muted">
          Uploads go to Supabase Storage. Use the URL in artwork cards, hero /
          about images or any link field.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-[3px] border border-line bg-panel/60 p-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Image file">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
              className="block w-full text-xs text-muted file:mr-3 file:rounded-[3px] file:border-0 file:bg-chip file:px-3 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.15em] file:text-fg hover:file:text-white"
            />
          </Field>
          <Field label="Alt text">
            <input
              className={inputClass}
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              maxLength={200}
              placeholder="Describe the image for screen readers"
            />
          </Field>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-[3px] border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
          >
            {error}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-[3px] bg-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          <p className="text-[11px] text-faint">
            PNG, JPEG, WebP, AVIF or GIF · max 8 MB
          </p>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-muted">Loading media…</p>
      ) : items.length === 0 ? (
        <p className="rounded-[3px] border border-line bg-panel/40 px-4 py-8 text-center text-sm text-muted">
          No images yet. Upload the first one.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-[3px] border border-line bg-panel/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.alt}
                className="h-40 w-full object-cover"
              />

              <div className="space-y-3 p-3">
                {editingAltId === item.id ? (
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      value={altDraft}
                      onChange={(event) => setAltDraft(event.target.value)}
                      maxLength={200}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveAlt(item)}
                      className="shrink-0 rounded-[3px] bg-accent px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-ink"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingAltId(null)}
                      className="shrink-0 rounded-[3px] border border-line px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startAltEdit(item)}
                    className="block w-full text-left text-xs text-fg transition-colors hover:text-white"
                    title="Edit alt text"
                  >
                    {item.alt || (
                      <span className="text-faint">No alt text — click to add</span>
                    )}
                  </button>
                )}

                <p className="truncate text-[10px] uppercase tracking-[0.12em] text-faint">
                  {item.path}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="rounded-[3px] border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-white"
                  >
                    {copiedId === item.id ? "Copied" : "Copy URL"}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[3px] border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-white"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-[3px] border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-red-300/80 transition-colors hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
