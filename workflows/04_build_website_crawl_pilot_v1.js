// n8n Code node: Build Website Crawl Pilot V1
// Mode: Run Once for All Items
//
// Input: Supabase account rows
// Output: one Actor config item + account lookup for downstream attribution.
//
// Pilot scope:
// - 5 deliberately varied pass_to_research accounts
// - depth 1
// - max 25 pages total
// - no AI summaries
// - respect robots.txt

const accounts = items.map(({ json }) => ({
  id: json.id,
  company_name: json.company_name,
  website_url: json.website_url,
  normalized_domain: json.normalized_domain,
}));

const invalid = accounts.filter(
  (a) => !a.id || !a.company_name || !a.website_url || !a.normalized_domain
);

if (invalid.length) {
  throw new Error(
    `Pilot account rows missing required fields: ${JSON.stringify(invalid)}`
  );
}

return [
  {
    json: {
      research_version: "WI-V1A.0.0",
      accounts,
      actor_input: {
        startUrls: accounts.map((a) => ({ url: a.website_url })),
        crawlerType: "playwright:adaptive",
        maxCrawlDepth: 1,
        maxCrawlPages: 25,
        useSitemaps: false,
        useLlmsTxt: false,
        respectRobotsTxtFile: true,
        proxyConfiguration: {
          useApifyProxy: true
        },
        blockMedia: true,
        saveMarkdown: true,
        saveHtml: false,
        saveHtmlAsFile: false,
        saveScreenshots: false,
        summarize: false
      }
    }
  }
];
