// n8n Code node: Rank Research Pages V1
// Mode: Run Once for All Items
//
// Deterministically ranks crawled pages for downstream LLM extraction.
// Selects up to 5 pages per account.

const MAX_PAGES_PER_ACCOUNT = 5;

const POSITIVE_TERMS = [
  "commercial",
  "janitorial",
  "office",
  "facility",
  "facilities",
  "service",
  "services",
  "industry",
  "industries",
  "about",
  "quote",
  "estimate",
  "contact"
];

const NEGATIVE_TERMS = [
  "blog",
  "news",
  "privacy",
  "terms",
  "career",
  "careers",
  "login",
  "signup",
  "cart",
  "shop"
];

function scorePage(r) {
  const url = String(r.source_url || "").toLowerCase();
  const title = String(r.page_title || "").toLowerCase();
  const combined = `${url} ${title}`;

  let score = 0;

  if (r.page_depth === 0) score += 8;

  for (const term of POSITIVE_TERMS) {
    if (combined.includes(term)) score += 3;
  }

  for (const term of NEGATIVE_TERMS) {
    if (combined.includes(term)) score -= 8;
  }

  const chars = Math.max(
    Number(r.text_original_chars || 0),
    Number(r.markdown_original_chars || 0)
  );

  if (chars >= 500) score += 2;
  if (chars >= 1500) score += 2;

  return score;
}

const matched = items
  .map((item) => item.json)
  .filter((r) => r.account_match_status === "matched" && r.account_id);

const groups = new Map();

for (const r of matched) {
  r.page_relevance_score = scorePage(r);

  if (!groups.has(r.account_id)) {
    groups.set(r.account_id, []);
  }

  groups.get(r.account_id).push(r);
}

const output = [];

for (const [accountId, rows] of groups.entries()) {
  rows.sort((a, b) => {
    if (b.page_relevance_score !== a.page_relevance_score) {
      return b.page_relevance_score - a.page_relevance_score;
    }

    const ad = a.page_depth ?? 999;
    const bd = b.page_depth ?? 999;
    return ad - bd;
  });

  for (const r of rows.slice(0, MAX_PAGES_PER_ACCOUNT)) {
    output.push({
      json: {
        ...r,
        selected_for_research: true
      }
    });
  }
}

return output;
