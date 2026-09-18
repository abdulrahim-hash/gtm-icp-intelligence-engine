// n8n Code node: Build Balanced Website Crawl Jobs V1.2
// Mode: Run Once for All Items
//
// One bounded Actor job per account.
// Resource controls are deliberately conservative for the pilot.

const RESEARCH_VERSION = "WI-V1A.2.0";
const MAX_PAGES_PER_ACCOUNT = 5;

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

        crawlerType: "playwright:adaptive",

        maxCrawlDepth: 1,
        maxCrawlPages: MAX_PAGES_PER_ACCOUNT,

        // Keep each small Actor run conservative.
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
