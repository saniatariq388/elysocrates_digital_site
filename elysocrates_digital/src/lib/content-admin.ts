export const ARTWORK_CATEGORIES = [
  { value: "concept-art", label: "Concept Art" },
  { value: "illustration", label: "Illustration" },
] as const;

export type ArtworkCategory = (typeof ARTWORK_CATEGORIES)[number]["value"];

export const WORK_COLUMNS = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "illustration", label: "Illustration" },
] as const;

export type WorkColumnKey = (typeof WORK_COLUMNS)[number]["value"];

export const LOGO_KINDS = [
  { value: "clients", label: "Clients" },
  { value: "projects", label: "Projects" },
] as const;

export type LogoKind = (typeof LOGO_KINDS)[number]["value"];

export const LOGO_STYLE_PRESETS = [
  { label: "Semibold caps", value: "font-semibold tracking-[0.15em]" },
  { label: "Black tight", value: "font-black tracking-tight" },
  { label: "Serif italic", value: "font-serif italic tracking-wide" },
  { label: "Bold wide", value: "font-bold tracking-[0.2em]" },
  { label: "Light wide", value: "font-light tracking-[0.22em]" },
  { label: "Light caps", value: "font-light tracking-[0.2em]" },
  { label: "Serif caps", value: "font-serif tracking-[0.12em]" },
  { label: "Semibold", value: "font-semibold tracking-[0.16em]" },
] as const;

export const SOCIAL_ICONS = [
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "link", label: "Generic link" },
] as const;

export type SocialIcon = (typeof SOCIAL_ICONS)[number]["value"];

export type ArtworkRecord = {
  id: string;
  title: string;
  detail: string;
  category: ArtworkCategory;
  image_url: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export type ArtworkInput = {
  title: string;
  detail: string;
  category: ArtworkCategory;
  image_url: string;
  position: number;
};

export type WorkEntryRecord = {
  id: string;
  column_key: WorkColumnKey;
  title: string;
  category: string;
  description: string;
  meta: string | null;
  made_in: string | null;
  tags: string[];
  position: number;
  created_at: string;
  updated_at: string;
};

export type WorkEntryInput = {
  column_key: WorkColumnKey;
  title: string;
  category: string;
  description: string;
  meta: string | null;
  made_in: string | null;
  tags: string[];
  position: number;
};

export type LogoItemRecord = {
  id: string;
  kind: LogoKind;
  label: string;
  style: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export type LogoItemInput = {
  kind: LogoKind;
  label: string;
  style: string;
  position: number;
};

export type SocialLinkRecord = {
  id: string;
  label: string;
  href: string;
  icon: SocialIcon;
  position: number;
  created_at: string;
  updated_at: string;
};

export type SocialLinkInput = {
  label: string;
  href: string;
  icon: SocialIcon;
  position: number;
};

export type SiteContentField = {
  key: string;
  label: string;
  group: string;
  multiline: boolean;
  value: string;
};

export type MediaRecord = {
  id: string;
  path: string;
  url: string;
  alt: string;
  created_at: string;
};

type ApiErrorBody = {
  error?: string;
  detail?: string | { msg?: string; loc?: (string | number)[] }[];
};

function describeError(data: ApiErrorBody | null, status: number): string {
  if (!data) return `Request failed (${status})`;
  if (typeof data.error === "string" && data.error) return data.error;
  if (typeof data.detail === "string" && data.detail) return data.detail;
  if (Array.isArray(data.detail)) {
    const parts = data.detail
      .map((item) => {
        const field = (item.loc ?? [])
          .filter((part) => part !== "body")
          .join(".");
        return field ? `${field}: ${item.msg ?? "invalid value"}` : item.msg;
      })
      .filter((value): value is string => Boolean(value));
    if (parts.length > 0) return parts.join("; ");
  }
  return `Request failed (${status})`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(describeError(data, response.status));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  return parseResponse<T>(response);
}

export async function adminUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    method: "POST",
    body: formData,
  });

  return parseResponse<T>(response);
}
