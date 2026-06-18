import { SEARCH_INDEX, type SearchResult } from "@/lib/search-index";

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreResult(result: SearchResult, terms: string[]): number {
  const title = normalize(result.title);
  const description = normalize(result.description);
  const href = normalize(result.href);
  let score = 0;

  for (const term of terms) {
    if (!term) continue;
    if (title === term) score += 100;
    else if (title.startsWith(term)) score += 50;
    else if (title.includes(term)) score += 30;
    if (description.includes(term)) score += 12;
    if (href.includes(term)) score += 8;
  }

  if (result.type === "faq" && terms.length > 0) score += 5;
  return score;
}

export function searchSite(query: string, limit = 20): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const terms = q.split(" ").filter(Boolean);
  if (terms.length === 0) return [];

  return SEARCH_INDEX.map((result) => ({
    result,
    score: scoreResult(result, terms),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ result }) => result);
}
