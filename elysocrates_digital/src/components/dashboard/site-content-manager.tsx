"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Field, inputClass } from "@/components/dashboard/fields";
import { MediaPicker } from "@/components/dashboard/media-picker";
import { Toast } from "@/components/dashboard/toast";
import { adminFetch, type SiteContentField } from "@/lib/content-admin";

function toValues(list: SiteContentField[]): Record<string, string> {
  return Object.fromEntries(list.map((field) => [field.key, field.value]));
}

export function SiteContentManager() {
  const router = useRouter();
  const [fields, setFields] = useState<SiteContentField[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminFetch<SiteContentField[]>("site-content")
      .then((data) => {
        if (!active) return;
        const initial = toValues(data);
        setFields(data);
        setValues(initial);
        setSaved(initial);
        setLoading(false);
      })
      .catch((cause) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "Could not load content",
        );
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, SiteContentField[]>();
    for (const field of fields) {
      const list = map.get(field.group) ?? [];
      list.push(field);
      map.set(field.group, list);
    }
    return Array.from(map, ([name, items]) => ({ name, items }));
  }, [fields]);

  const dirtyCount = fields.filter(
    (field) => values[field.key] !== saved[field.key],
  ).length;

  async function handleSave() {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const data = await adminFetch<SiteContentField[]>("site-content", {
        method: "PUT",
        body: JSON.stringify({ values }),
      });
      const updated = toValues(data);
      setFields(data);
      setValues(updated);
      setSaved(updated);
      setNotice("Content saved.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save content");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setValues(saved);
    setNotice(null);
  }

  return (
    <div>
      <Toast message={notice} onDismiss={() => setNotice(null)} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Site content</h2>
          <p className="mt-1 text-sm text-muted">
            Page copy and images. Empty fields render as empty or hidden,
            depending on the section.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirtyCount > 0 && (
            <span className="text-[10px] uppercase tracking-[0.18em] text-accent">
              {dirtyCount} unsaved
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || dirtyCount === 0}
            className="rounded-[3px] bg-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-5 rounded-[3px] border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading content…</p>
      ) : fields.length === 0 ? (
        <p className="rounded-[3px] border border-line bg-panel/40 px-4 py-8 text-center text-sm text-muted">
          No editable fields returned by the content service.
        </p>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.name}>
              <h3 className="mb-4 border-b border-line pb-2 text-[11px] uppercase tracking-[0.22em] text-faint">
                {group.name}
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                {group.items.map((field) => {
                  const isImage = field.key.endsWith("_image");
                  return (
                    <Field
                      key={field.key}
                      label={field.label}
                      className={field.multiline ? "md:col-span-2" : ""}
                    >
                      {field.multiline ? (
                        <textarea
                          className={`${inputClass} min-h-20 resize-y`}
                          rows={3}
                          value={values[field.key] ?? ""}
                          onChange={(event) =>
                            setValues({
                              ...values,
                              [field.key]: event.target.value,
                            })
                          }
                        />
                      ) : (
                        <input
                          className={inputClass}
                          value={values[field.key] ?? ""}
                          onChange={(event) =>
                            setValues({
                              ...values,
                              [field.key]: event.target.value,
                            })
                          }
                        />
                      )}
                      {isImage && (
                        <MediaPicker
                          onSelect={(url) =>
                            setValues({ ...values, [field.key]: url })
                          }
                        />
                      )}
                    </Field>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {dirtyCount > 0 && (
        <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-3 rounded-[3px] border border-line bg-panel px-4 py-3">
          <div className="min-w-0">
            {error && (
              <p role="alert" className="text-xs text-red-300">
                {error}
              </p>
            )}
            <p className="text-xs text-muted">
              {dirtyCount} unsaved {dirtyCount === 1 ? "field" : "fields"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              className="rounded-[3px] border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-white"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-[3px] bg-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
