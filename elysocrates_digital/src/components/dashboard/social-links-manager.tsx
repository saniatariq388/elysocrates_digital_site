"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Field, inputClass } from "@/components/dashboard/fields";
import { Toast } from "@/components/dashboard/toast";
import {
  adminFetch,
  SOCIAL_ICONS,
  type SocialIcon,
  type SocialLinkInput,
  type SocialLinkRecord,
} from "@/lib/content-admin";

const emptyLink: SocialLinkInput = {
  label: "",
  href: "https://",
  icon: "link",
  position: 0,
};

export function SocialLinksManager() {
  const router = useRouter();
  const [items, setItems] = useState<SocialLinkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [draft, setDraft] = useState<SocialLinkInput>(emptyLink);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await adminFetch<SocialLinkRecord[]>("social-links");
      setItems(data);
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load social links",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminFetch<SocialLinkRecord[]>("social-links")
      .then((data) => {
        if (!active) return;
        setItems(data);
        setLoading(false);
      })
      .catch((cause) => {
        if (!active) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load social links",
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
    setDraft(emptyLink);
  }

  function startEdit(item: SocialLinkRecord) {
    setIsNew(false);
    setEditingId(item.id);
    setDraft({
      label: item.label,
      href: item.href,
      icon: item.icon,
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
        await adminFetch<SocialLinkRecord>("social-links", {
          method: "POST",
          body: JSON.stringify(draft),
        });
      } else if (editingId) {
        await adminFetch<SocialLinkRecord>(`social-links/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(draft),
        });
      }
      cancelEdit();
      await load();
      setNotice(isNew ? "Social link created." : "Social link saved.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save social link",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: SocialLinkRecord) {
    if (!window.confirm(`Delete “${item.label}”?`)) return;
    setError(null);
    try {
      await adminFetch<undefined>(`social-links/${item.id}`, {
        method: "DELETE",
      });
      if (editingId === item.id) cancelEdit();
      await load();
      setNotice("Social link deleted.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete social link",
      );
    }
  }

  return (
    <div>
      <Toast message={notice} onDismiss={() => setNotice(null)} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Social links</h2>
          <p className="mt-1 text-sm text-muted">
            Footer icons, the links page and anywhere else socials appear.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="rounded-[3px] bg-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90"
        >
          New link
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
            <Field label="Label">
              <input
                className={inputClass}
                value={draft.label}
                onChange={(event) =>
                  setDraft({ ...draft, label: event.target.value })
                }
                maxLength={60}
                required
              />
            </Field>
            <Field label="Icon">
              <select
                className={inputClass}
                value={draft.icon}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    icon: event.target.value as SocialIcon,
                  })
                }
              >
                {SOCIAL_ICONS.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="URL" className="md:col-span-2">
              <input
                className={inputClass}
                type="url"
                value={draft.href}
                onChange={(event) =>
                  setDraft({ ...draft, href: event.target.value })
                }
                maxLength={500}
                placeholder="https://…"
                required
              />
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
              {saving ? "Saving…" : isNew ? "Create link" : "Save changes"}
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
        <p className="text-sm text-muted">Loading social links…</p>
      ) : items.length === 0 ? (
        <p className="rounded-[3px] border border-line bg-panel/40 px-4 py-8 text-center text-sm text-muted">
          No social links yet. Create the first one.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-[3px] border border-line">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-4 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#dedede]">{item.label}</p>
                <p className="truncate text-xs text-faint">{item.href}</p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-faint">
                {item.icon} · {item.position}
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
