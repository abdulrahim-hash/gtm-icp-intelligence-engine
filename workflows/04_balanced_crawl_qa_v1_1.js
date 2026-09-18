// n8n Code node: Balanced Crawl QA V1.1
// Mode: Run Once for All Items
//
// Input: ranked research pages
// Reads mapped pages and pilot accounts from upstream nodes.

const ranked = items.map(i => i.json);

const mapped = $("Map Crawled Pages to Accounts V1")
  .all()
  .map(i => i.json);

const pilotAccounts = $("Fetch Pilot Accounts")
  .all()
  .map(i => i.json);

const byAccount = {};

for (const account of pilotAccounts) {
  byAccount[account.id] = {
    company_name: account.company_name,
    normalized_domain: account.normalized_domain,
    mapped_pages: 0,
    selected_pages: 0,
    best_page_score: null,
    best_page_chars: null,
    best_page_url: null
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

  const score = Number(page.page_relevance_score || 0);
  const chars = Math.max(
    Number(page.text_original_chars || 0),
    Number(page.markdown_original_chars || 0)
  );

  if (a.best_page_score === null || score > a.best_page_score) {
    a.best_page_score = score;
    a.best_page_chars = chars;
    a.best_page_url = page.source_url;
  }
}

const rows = Object.values(byAccount)
  .sort((a, b) => a.company_name.localeCompare(b.company_name));

const summary = {
  research_version: "WI-V1A.1.0",
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

  min_mapped_pages_per_account:
    rows.length ? Math.min(...rows.map(a => a.mapped_pages)) : 0,

  max_mapped_pages_per_account:
    rows.length ? Math.max(...rows.map(a => a.mapped_pages)) : 0
};

rows.forEach((a, index) => {
  const n = index + 1;
  summary[`account_${n}`] = a.company_name;
  summary[`account_${n}_mapped`] = a.mapped_pages;
  summary[`account_${n}_selected`] = a.selected_pages;
  summary[`account_${n}_best_score`] = a.best_page_score;
  summary[`account_${n}_best_chars`] = a.best_page_chars;
  summary[`account_${n}_best_url`] = a.best_page_url;
});

return [{ json: summary }];
