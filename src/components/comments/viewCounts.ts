export const viewCountPlaceholder = "-";

export async function getArtalkViewCounts(server: string, site: string, pageKeys: string[], signal: AbortSignal) {
  const url = new URL(`${server.replace(/\/+$/, "")}/api/v2/stats/page_pv`, window.location.origin);
  url.search = new URLSearchParams({ page_keys: pageKeys.join(","), site_name: site }).toString();

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Artalk stats request failed: ${response.status}`);

  const { data } = await response.json();
  const counts = new Map<string, number>();
  for (const key of pageKeys) {
    const count = data?.[key] ?? 0;
    if (typeof count === "number" && Number.isFinite(count)) counts.set(key, count);
  }
  return counts;
}
