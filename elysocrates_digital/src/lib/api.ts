import { cacheLife } from "next/cache";

import {
  artworks as fallbackArtworks,
  clients as fallbackClients,
  projects as fallbackProjects,
  siteContentDefaults,
  socials as fallbackSocials,
  workColumns as fallbackWorkColumns,
  type Artwork,
  type ArtworkCategory,
  type LogoStripItem,
  type SiteSocialLink,
  type SocialIconName,
  type WorkColumn,
} from "@/lib/content";
import { resolveImageUrl } from "@/lib/image-url";

const API_URL = (process.env.API_URL ?? "http://127.0.0.1:8001").replace(
  /\/+$/,
  "",
);

type ArtworkRecord = {
  title: string;
  detail: string;
  category: ArtworkCategory;
  image_url: string;
};

type WorkColumnKey = "personal" | "work" | "illustration";

type WorkEntryRecord = {
  column_key: WorkColumnKey;
  title: string;
  category: string;
  description: string;
  meta: string | null;
  made_in: string | null;
  tags: string[];
};

type LogoItemRecord = {
  kind: "clients" | "projects";
  label: string;
  style: string;
};

type SocialLinkRecord = {
  label: string;
  href: string;
  icon: string;
};

type SiteContentField = {
  key: string;
  value: string;
};

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getArtworks(
  category?: ArtworkCategory,
): Promise<Artwork[]> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 30 });

  const records = await getJson<ArtworkRecord[]>(
    category ? `/artworks?category=${encodeURIComponent(category)}` : "/artworks",
  );
  if (!records) {
    return category
      ? fallbackArtworks.filter((artwork) => artwork.category === category)
      : fallbackArtworks;
  }
  return records.map((record) => ({
    src: resolveImageUrl(record.image_url),
    alt: record.title,
    title: record.title,
    detail: record.detail,
    category: record.category,
  }));
}

const WORK_COLUMN_LABELS: Record<WorkColumnKey, string> = {
  personal: "Personal",
  work: "Work",
  illustration: "Illustration",
};

export async function getWorkColumns(): Promise<WorkColumn[]> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 30 });

  const records = await getJson<WorkEntryRecord[]>("/work-entries");
  if (!records) return fallbackWorkColumns;

  return (Object.keys(WORK_COLUMN_LABELS) as WorkColumnKey[])
    .map((key) => ({
      label: WORK_COLUMN_LABELS[key],
      entries: records
        .filter((record) => record.column_key === key)
        .map((record) => ({
          title: record.title,
          category: record.category,
          description: record.description,
          meta: record.meta ?? undefined,
          madeIn: record.made_in ?? undefined,
          tags: record.tags,
        })),
    }))
    .filter((column) => column.entries.length > 0);
}

export async function getLogoStrips(): Promise<{
  clients: LogoStripItem[];
  projects: LogoStripItem[];
}> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 30 });

  const records = await getJson<LogoItemRecord[]>("/logo-items");
  if (!records) {
    return { clients: fallbackClients, projects: fallbackProjects };
  }
  const toStrip = (kind: LogoItemRecord["kind"]) =>
    records
      .filter((record) => record.kind === kind)
      .map((record) => ({ label: record.label, className: record.style }));
  return { clients: toStrip("clients"), projects: toStrip("projects") };
}

function toIcon(value: string): SocialIconName {
  switch (value) {
    case "instagram":
    case "x":
    case "facebook":
    case "linkedin":
    case "link":
      return value;
    default:
      return "link";
  }
}

export async function getSocialLinks(): Promise<SiteSocialLink[]> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 30 });

  const records = await getJson<SocialLinkRecord[]>("/social-links");
  if (!records) return fallbackSocials;
  return records.map((record) => ({
    label: record.label,
    href: record.href,
    icon: toIcon(record.icon),
  }));
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 30 });

  const fields = await getJson<SiteContentField[]>("/site-content");
  if (!fields) return siteContentDefaults;

  const settings: Record<string, string> = { ...siteContentDefaults };
  for (const field of fields) settings[field.key] = field.value;
  return settings;
}
