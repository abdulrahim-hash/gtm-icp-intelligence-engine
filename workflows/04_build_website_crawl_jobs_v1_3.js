// n8n Code node: Build Website Crawl Jobs V1.3
// Mode: Run Once for All Items
//
// Strategy:
// 1) Cheap/fast Cheerio crawl first.
// 2) Adaptive browser crawl only for accounts with insufficient content.
//
// Output: one crawl job per account.

const RESEARCH_VERSION = "WI-V1A.3.0";
const MAX_CRAWL_PAGES = 5;
const MAX_RESULTS = 5;

function clean(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

return items.map(({ json }) => {
  const id = clean(json.id);
  const companyName = clean(json.company_name);
  const websiteUrl = clean(json.website_url);
  const normalizedDomain = clean(json.normalized_domain);

  if (!id || !companyName || !websiteUrl || !normalizedDomain) {
    throw new Error(
      `Pilot account missing required fields: ${JSON.stringify(json)}`
    );
  }

  return {
    json: {
      research_version: RESEARCH_VERSION,

      account_id: id,
      company_name: companyName,
      normalized_domain: normalizedDomain,
      website_url: websiteUrl,

      actor_input: {
        startUrls: [{ url: websiteUrl }],

        // Raw HTTP first: substantially lighter/faster than browser crawling.
        crawlerType: "cheerio",

        maxCrawlDepth: 1,
        maxCrawlPages: MAX_CRAWL_PAGES,
        maxResults: MAX_RESULTS,

        initialConcurrency: 1,
        maxConcurrency: 1,

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
  };
});
