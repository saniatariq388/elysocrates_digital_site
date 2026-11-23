"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Field, inputClass } from "@/components/dashboard/fields";
import { MediaPicker } from "@/components/dashboard/media-picker";
import { Toast } from "@/components/dashboard/toast";
import { resolveImageUrl } from "@/lib/image-url";
import {
  adminFetch,
  ARTWORK_CATEGORIES,
  type ArtworkCategory,
  type ArtworkInput,
  type ArtworkRecord,
} from "@/lib/content-admin";

const emptyArtwork: ArtworkInput = {
  title: "",
  detail: "",
  category: "concept-art",
  image_url: "/images/",
  position: 0,
};

export function ArtworksManager() {
  const router = useRouter();
  const [items, setItems] = useState<ArtworkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [draft, setDraft] = useState<ArtworkInput>(emptyArtwork);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await adminFetch<ArtworkRecord[]>("artworks");
      setItems(data);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load artwork");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminFetch<ArtworkRecord[]>("artworks")
      .then((data) => {
        if (!active) return;
        setItems(data);
        setLoading(false);
      })
      .catch((cause) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "Could not load artwork",
        );
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function startNew() {
    setIsNew(true);
    setEditingId(null);
    setDraft(emptyArtwork);
  }

  function startEdit(item: ArtworkRecord) {
    setIsNew(false);
    setEditingId(item.id);
    setDraft({
      title: item.title,
      detail: item.detail,
      category: item.category,
      image_url: item.image_url,
      position: item.position,
    });
  }

  function cancelEdit() {
    setIsNew(false);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        await adminFetch<ArtworkRecord>("artworks", {
          method: "POST",
          body: JSON.stringify(draft),
        });
      } else if (editingId) {
        await adminFetch<ArtworkRecord>(`artworks/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(draft),
        });
      }
      cancelEdit();
      await load();
      setNotice(isNew ? "Artwork created." : "Artwork saved.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save artwork");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: ArtworkRecord) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setError(null);
    try {
      await adminFetch<undefined>(`artworks/${item.id}`, { method: "DELETE" });
      if (editingId === item.id) cancelEdit();
      await load();
      setNotice("Artwork deleted.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete artwork",
      );
    }
  }

  return (
    <div>
      <Toast message={notice} onDismiss={() => setNotice(null)} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Artwork cards</h2>
          <p className="mt-1 text-sm text-muted">
            Images shown in the home gallery and category pages.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="rounded-[3px] bg-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90"
        >
          New artwork
        </button>
      </div>

      {error && !(isNew || editingId) && (
        <p
          role="alert"
          className="mb-5 rounded-[3px] border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      {(isNew || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-[3px] border border-line bg-panel/60 p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" className="md:col-span-2">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                maxLength={200}
                required
              />
            </Field>
            <Field label="Detail" className="md:col-span-2">
              <input
                className={inputClass}
                value={draft.detail}
                onChange={(event) =>
                  setDraft({ ...draft, detail: event.target.value })
                }
                maxLength={400}
                placeholder="Environment Concept Art · Client · Tools"
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={draft.category}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    category: event.target.value as ArtworkCategory,
                  })
                }
              >
                {ARTWORK_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Position">
              <input
                className={inputClass}
                type="number"
                value={draft.position}
                onChange={(event) =>
                  setDraft({ ...draft, position: Number(event.target.value) })
                }
              />
            </Field>
            <Field label="Image URL" className="md:col-span-2">
              <input
                className={inputClass}
                value={draft.image_url}
                onChange={(event) =>
                  setDraft({ ...draft, image_url: event.target.value })
                }
                maxLength={500}
                placeholder="/images/example.png or https://…"
                required
              />
              <MediaPicker
                onSelect={(url) => setDraft({ ...draft, image_url: url })}
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

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-[3px] bg-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving
                ? "Saving…"
                : isNew
                  ? "Create artwork"
                  : "Save changes"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-[3px] border border-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading artwork…</p>
      ) : items.length === 0 ? (
        <p className="rounded-[3px] border border-line bg-panel/40 px-4 py-8 text-center text-sm text-muted">
          No artwork cards yet. Create the first one.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-[3px] border border-line">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-4 px-4 py-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(item.image_url)}
                alt=""
                className="h-12 w-20 shrink-0 rounded-[2px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#dedede]">
                  {item.title}
                </p>
                <p className="truncate text-xs text-faint">{item.detail}</p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-faint">
                {item.category} · {item.position}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-[3px] border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="rounded-[3px] border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-red-300/80 transition-colors hover:text-red-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
