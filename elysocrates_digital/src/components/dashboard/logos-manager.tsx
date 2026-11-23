"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Field, inputClass } from "@/components/dashboard/fields";
import { Toast } from "@/components/dashboard/toast";
import {
  adminFetch,
  LOGO_KINDS,
  LOGO_STYLE_PRESETS,
  type LogoItemInput,
  type LogoItemRecord,
  type LogoKind,
} from "@/lib/content-admin";

const emptyLogo: LogoItemInput = {
  kind: "clients",
  label: "",
  style: LOGO_STYLE_PRESETS[0].value,
  position: 0,
};

const presetValues: string[] = LOGO_STYLE_PRESETS.map((preset) => preset.value);

export function LogosManager() {
  const router = useRouter();
  const [items, setItems] = useState<LogoItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [draft, setDraft] = useState<LogoItemInput>(emptyLogo);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await adminFetch<LogoItemRecord[]>("logo-items");
      setItems(data);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load logos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminFetch<LogoItemRecord[]>("logo-items")
      .then((data) => {
        if (!active) return;
        setItems(data);
        setLoading(false);
      })
      .catch((cause) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not load logos");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function startNew(kind: LogoKind) {
    setIsNew(true);
    setEditingId(null);
    setDraft({ ...emptyLogo, kind });
  }

  function startEdit(item: LogoItemRecord) {
    setIsNew(false);
    setEditingId(item.id);
    setDraft({
      kind: item.kind,
      label: item.label,
      style: item.style,
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
        await adminFetch<LogoItemRecord>("logo-items", {
          method: "POST",
          body: JSON.stringify(draft),
        });
      } else if (editingId) {
        await adminFetch<LogoItemRecord>(`logo-items/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(draft),
        });
      }
      cancelEdit();
      await load();
      setNotice(isNew ? "Logo item created." : "Logo item saved.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save logo");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: LogoItemRecord) {
    if (!window.confirm(`Delete “${item.label}”?`)) return;
    setError(null);
    try {
      await adminFetch<undefined>(`logo-items/${item.id}`, {
        method: "DELETE",
      });
      if (editingId === item.id) cancelEdit();
      await load();
      setNotice("Logo item deleted.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete logo");
    }
  }

  const isPreset = presetValues.includes(draft.style);

  return (
    <div>
      <Toast message={notice} onDismiss={() => setNotice(null)} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Clients &amp; projects
          </h2>
          <p className="mt-1 text-sm text-muted">
            The text-only logo strips under the hero on the home page.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => startNew("clients")}
            className="rounded-[3px] bg-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90"
          >
            New client
          </button>
          <button
            type="button"
            onClick={() => startNew("projects")}
            className="rounded-[3px] border border-line px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-white"
          >
            New project
          </button>
        </div>
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
            <Field label="Strip">
              <select
                className={inputClass}
                value={draft.kind}
                onChange={(event) =>
                  setDraft({ ...draft, kind: event.target.value as LogoKind })
                }
              >
                {LOGO_KINDS.map((kind) => (
                  <option key={kind.value} value={kind.value}>
                    {kind.label}
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
            <Field label="Label" className="md:col-span-2">
              <input
                className={inputClass}
                value={draft.label}
                onChange={(event) =>
                  setDraft({ ...draft, label: event.target.value })
                }
                maxLength={120}
                required
              />
            </Field>
            <Field label="Style preset">
              <select
                className={inputClass}
                value={isPreset ? draft.style : "__custom"}
                onChange={(event) => {
                  if (event.target.value === "__custom") {
                    setDraft({ ...draft, style: "" });
                  } else {
                    setDraft({ ...draft, style: event.target.value });
                  }
                }}
              >
                {LOGO_STYLE_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
                <option value="__custom">Custom classes…</option>
              </select>
            </Field>
            <Field label="CSS classes">
              <input
                className={inputClass}
                value={draft.style}
                onChange={(event) =>
                  setDraft({ ...draft, style: event.target.value })
                }
                maxLength={200}
                placeholder="font-serif italic tracking-wide"
              />
            </Field>
          </div>

          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-faint">
            Preview
          </p>
          <p className={`mt-1 text-sm text-fg ${draft.style}`}>
            {draft.label || "Preview label"}
          </p>

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
              {saving ? "Saving…" : isNew ? "Create item" : "Save changes"}
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
        <p className="text-sm text-muted">Loading logos…</p>
      ) : (
        <div className="space-y-8">
          {LOGO_KINDS.map((kind) => {
            const rows = items.filter((item) => item.kind === kind.value);
            return (
              <section key={kind.value}>
                <h3 className="mb-3 text-[11px] uppercase tracking-[0.22em] text-faint">
                  {kind.label}
                </h3>
                {rows.length === 0 ? (
                  <p className="rounded-[3px] border border-line bg-panel/40 px-4 py-6 text-center text-sm text-muted">
                    No {kind.label.toLowerCase()} yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-line rounded-[3px] border border-line">
                    {rows.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center gap-4 px-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm text-fg ${item.style}`}>
                            {item.label}
                          </p>
                          <p className="mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-faint">
                            {item.style || "no style classes"} · {item.position}
                          </p>
                        </div>
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
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
