export interface SearchEntry {
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  publishedLabel: string;
  href: string;
}

const normalize = (text: string) => text.normalize("NFKC").toLocaleLowerCase();

function scoreEntry(entry: SearchEntry, tokens: string[]) {
  const fields = [
    { values: [entry.title], weight: 12 },
    { values: entry.tags, weight: 8 },
    { values: [entry.category], weight: 6 },
    { values: [entry.description], weight: 3 },
  ];
  let score = 0;

  for (const token of tokens) {
    let tokenScore = 0;

    for (const { values, weight } of fields) {
      for (const value of values) {
        const text = normalize(value);
        if (!text.includes(token)) continue;

        const matchScore = weight + (text === token ? weight : 0) + (text.startsWith(token) ? weight / 2 : 0);
        tokenScore = Math.max(tokenScore, matchScore);
      }
    }

    if (tokenScore === 0) return 0;
    score += tokenScore;
  }

  return score;
}

export function findSearchResults(index: SearchEntry[], query: string) {
  const tokens = normalize(query).trim().split(/\s+/u);

  return index
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        Date.parse(right.entry.publishedAt) - Date.parse(left.entry.publishedAt) ||
        left.entry.title.localeCompare(right.entry.title),
    )
    .slice(0, 8)
    .map(({ entry }) => entry);
}

let index: SearchEntry[] | undefined;
let pendingIndex: Promise<SearchEntry[]> | undefined;

export function getSearchIndex() {
  if (index) return index;

  pendingIndex ??= (async () => {
    const response = await fetch("/search-index.json");
    if (!response.ok) throw new Error(`Search index request failed with ${response.status}`);

    const entries: unknown = await response.json();
    if (!Array.isArray(entries)) throw new TypeError("Search index is not an array");
    index = entries as SearchEntry[];
    return index;
  })().finally(() => {
    pendingIndex = undefined;
  });
  return pendingIndex;
}
