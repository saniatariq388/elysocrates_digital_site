export function resolveImageUrl(value: string | null | undefined): string {
  const url = (value ?? "").trim();
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("//")) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return url;
  return `/images/${url}`;
}
