"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Field, inputClass } from "@/components/dashboard/fields";
import { Toast } from "@/components/dashboard/toast";
import {
  adminFetch,
  WORK_COLUMNS,
  type WorkColumnKey,
  type WorkEntryInput,
  type WorkEntryRecord,
} from "@/lib/content-admin";

type EntryDraft = {
  column_key: WorkColumnKey;
  title: string;
  category: string;
  description: string;
  meta: string;
  made_in: string;
  position: number;
};

const emptyEntry: EntryDraft = {
  column_key: "personal",
  title: "",
  category: "Environment Concept Art",
  description: "",
  meta: "",
  made_in: "",
  position: 0,
};

function toDraft(entry: WorkEntryRecord): EntryDraft {
  return {
    column_key: entry.column_key,
    title: entry.title,
    category: entry.category,
    description: entry.description,
    meta: entry.meta ?? "",
    made_in: entry.made_in ?? "",
    position: entry.position,
  };
}

function toPayload(draft: EntryDraft, tags: string): WorkEntryInput {
  return {
    column_key: draft.column_key,
    title: draft.title,
    category: draft.category,
    description: draft.description,
    meta: draft.meta.trim() || null,
    made_in: draft.made_in.trim() || null,
    tags: tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    position: draft.position,
  };
}

export function WorkEntriesManager() {
  const router = useRouter();
  const [items, setItems] = useState<WorkEntryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [draft, setDraft] = useState<EntryDraft>(emptyEntry);
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await adminFetch<WorkEntryRecord[]>("work-entries");
      setItems(data);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load works");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminFetch<WorkEntryRecord[]>("work-entries")
      .then((data) => {
        if (!active) return;
        setItems(data);
        setLoading(false);
      })
      .catch((cause) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not load works");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function startNew() {
    setIsNew(true);
    setEditingId(null);
    setDraft(emptyEntry);
    setTagsText("");
  }

  function startEdit(entry: WorkEntryRecord) {
    setIsNew(false);
    setEditingId(entry.id);
    setDraft(toDraft(entry));
    setTagsText(entry.tags.join(", "));
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
      const payload = toPayload(draft, tagsText);
      if (isNew) {
        await adminFetch<WorkEntryRecord>("work-entries", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else if (editingId) {
        await adminFetch<WorkEntryRecord>(`work-entries/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }
      cancelEdit();
      await load();
      setNotice(isNew ? "Entry created." : "Entry saved.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save work");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entry: WorkEntryRecord) {
    if (!window.confirm(`Delete “${entry.title}”?`)) return;
    setError(null);
    try {
      await adminFetch<undefined>(`work-entries/${entry.id}`, {
        method: "DELETE",
      });
      if (editingId === entry.id) cancelEdit();
      await load();
      setNotice("Entry deleted.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete work",
      );
    }
  }

  return (
    <div>
      <Toast message={notice} onDismiss={() => setNotice(null)} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Selected works</h2>
          <p className="mt-1 text-sm text-muted">
            Text entries in the home page “Selected Works” columns.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="rounded-[3px] bg-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90"
        >
          New entry
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
            <Field label="Column">
              <select
                className={inputClass}
                value={draft.column_key}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    column_key: event.target.value as WorkColumnKey,
                  })
                }
              >
                {WORK_COLUMNS.map((column) => (
                  <option key={column.value} value={column.value}>
                    {column.label}
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
            <Field label="Title">
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
            <Field label="Category">
              <input
                className={inputClass}
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
                maxLength={120}
                placeholder="Environment Concept Art"
              />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea
                className={`${inputClass} min-h-20 resize-y`}
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
                rows={3}
              />
            </Field>
            <Field label="Meta (client line)">
              <input
                className={inputClass}
                value={draft.meta}
                onChange={(event) =>
                  setDraft({ ...draft, meta: event.target.value })
                }
                maxLength={200}
                placeholder="Client: Studio · Project"
              />
            </Field>
            <Field label="Made in">
              <input
                className={inputClass}
                value={draft.made_in}
                onChange={(event) =>
                  setDraft({ ...draft, made_in: event.target.value })
                }
                maxLength={120}
                placeholder="Blender & Photoshop"
              />
            </Field>
            <Field label="Tags (comma separated)" className="md:col-span-2">
              <input
                className={inputClass}
                value={tagsText}
                onChange={(event) => setTagsText(event.target.value)}
                placeholder="environment design, 3d blockout"
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
              {saving ? "Saving…" : isNew ? "Create entry" : "Save changes"}
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
        <p className="text-sm text-muted">Loading selected works…</p>
      ) : items.length === 0 ? (
        <p className="rounded-[3px] border border-line bg-panel/40 px-4 py-8 text-center text-sm text-muted">
          No entries yet. Create the first one.
        </p>
      ) : (
        <div className="space-y-8">
          {WORK_COLUMNS.map((column) => {
            const entries = items.filter(
              (item) => item.column_key === column.value,
            );
            if (entries.length === 0) return null;
            return (
              <section key={column.value}>
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-faint">
                  {column.label} · {entries.length}
                </h3>
                <ul className="mt-3 divide-y divide-line rounded-[3px] border border-line">
                  {entries.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex flex-wrap items-start gap-4 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#dedede]">
                          {entry.title}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-faint">
                          {entry.category} · #{entry.position}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted">
                          {entry.description}
                        </p>
                        {entry.tags.length > 0 && (
                          <p className="mt-1 text-[11px] text-faint">
                            {entry.tags.join(" · ")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(entry)}
                          className="rounded-[3px] border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry)}
                          className="rounded-[3px] border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-red-300/80 transition-colors hover:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
