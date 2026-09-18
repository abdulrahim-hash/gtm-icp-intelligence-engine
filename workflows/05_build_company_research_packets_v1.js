// n8n Code node: Build Company Research Packets V1
// Mode: Run Once for All Items
//
// Input: ranked/selected website pages.
// Output: one bounded research packet per account.

const RESEARCH_VERSION = "WI-V1B.0.0";
const MAX_PAGES_PER_ACCOUNT = 5;
const MAX_CHARS_PER_PAGE = 7000;
const MAX_PACKET_CHARS = 24000;

function clean(v) {
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

const rows = items
  .map(i => i.json)
  .filter(r => r.account_id && r.company_name && r.source_url);

const groups = new Map();

for (const r of rows) {
  if (!groups.has(r.account_id)) {
    groups.set(r.account_id, {
      account_id: r.account_id,
      company_name: r.company_name,
      normalized_domain: r.normalized_domain,
      pages: []
    });
  }

  groups.get(r.account_id).pages.push(r);
}

const output = [];

for (const group of groups.values()) {
  const selected = group.pages
    .sort((a, b) =>
      Number(b.page_relevance_score || 0) -
      Number(a.page_relevance_score || 0)
    )
    .slice(0, MAX_PAGES_PER_ACCOUNT);

  let used = 0;
  const documents = [];

  for (const page of selected) {
    if (used >= MAX_PACKET_CHARS) break;

    const raw =
      clean(page.content_markdown) ||
      clean(page.content_text);

    if (!raw) continue;

    const remaining = MAX_PACKET_CHARS - used;
    const content = raw.slice(
      0,
      Math.min(MAX_CHARS_PER_PAGE, remaining)
    );

    if (!content) continue;

    used += content.length;

    documents.push({
      source_url: page.source_url,
      source_observed_at:
        page.source_observed_at || new Date().toISOString(),
      page_title: page.page_title || null,
      page_relevance_score:
        Number(page.page_relevance_score || 0),
      content
    });
  }

  if (!documents.length) continue;

  output.push({
    json: {
      research_version: RESEARCH_VERSION,
      account_id: group.account_id,
      company_name: group.company_name,
      normalized_domain: group.normalized_domain,
      page_count: documents.length,
      packet_chars: used,
      source_urls: documents.map(d => d.source_url),
      documents
    }
  });
}

return output;
