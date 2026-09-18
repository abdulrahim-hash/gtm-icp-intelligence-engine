// n8n Code node: Website Crawl QA V1.3
// Mode: Run Once for All Items
//
// Produces one flat summary and identifies accounts requiring browser fallback.

const ranked = items.map(i => i.json);

const mapped = $("Map Crawled Pages to Accounts V1.1")
  .all()
  .map(i => i.json);

const pilotAccounts = $("Fetch Pilot Accounts")
  .all()
  .map(i => i.json);

const MIN_BEST_PAGE_CHARS = 500;

const byAccount = {};

for (const account of pilotAccounts) {
  byAccount[account.id] = {
    company_name: account.company_name,
    normalized_domain: account.normalized_domain,
    mapped_pages: 0,
    selected_pages: 0,
    best_page_score: null,
    best_page_chars: 0,
    best_page_url: null,
    total_selected_chars: 0
  };
}

for (const page of mapped) {
  if (page.account_id && byAccount[page.account_id]) {
    byAccount[page.account_id].mapped_pages++;
  }
}

for (const page of ranked) {
  if (!page.account_id || !byAccount[page.account_id]) continue;

  const a = byAccount[page.account_id];
  a.selected_pages++;

  const chars = Math.max(
    Number(page.text_original_chars || 0),
    Number(page.markdown_original_chars || 0)
  );
  const score = Number(page.page_relevance_score || 0);

  a.total_selected_chars += chars;

  if (a.best_page_score === null || score > a.best_page_score) {
    a.best_page_score = score;
    a.best_page_chars = chars;
    a.best_page_url = page.source_url;
  }
}

const rows = Object.values(byAccount)
  .sort((a, b) => a.company_name.localeCompare(b.company_name));

for (const a of rows) {
  a.fallback_required =
    a.mapped_pages === 0 ||
    a.selected_pages === 0 ||
    a.best_page_chars < MIN_BEST_PAGE_CHARS;
}

const fallback = rows.filter(a => a.fallback_required);

const summary = {
  research_version: "WI-V1A.3.0",
  crawler_strategy: "cheerio_first",

  raw_crawled_pages: $("Run Apify Website Crawler").all().length,
  mapped_pages: mapped.length,
  unmatched_pages: mapped.filter(
    p => p.account_match_status !== "matched"
  ).length,
  selected_pages: ranked.length,

  accounts_expected: rows.length,
  accounts_with_mapped_pages:
    rows.filter(a => a.mapped_pages > 0).length,
  accounts_with_selected_pages:
    rows.filter(a => a.selected_pages > 0).length,

  accounts_requiring_adaptive_fallback: fallback.length,
  fallback_accounts: fallback.map(a => a.company_name).join(" | ") || null
};

rows.forEach((a, index) => {
  const n = index + 1;

  summary[`account_${n}`] = a.company_name;
  summary[`account_${n}_mapped`] = a.mapped_pages;
  summary[`account_${n}_selected`] = a.selected_pages;
  summary[`account_${n}_best_score`] = a.best_page_score;
  summary[`account_${n}_best_chars`] = a.best_page_chars;
  summary[`account_${n}_total_selected_chars`] = a.total_selected_chars;
  summary[`account_${n}_fallback_required`] = a.fallback_required;
});

return [{ json: summary }];
