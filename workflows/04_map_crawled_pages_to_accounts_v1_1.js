// n8n Code node: Map Crawled Pages to Accounts V1.1
// Mode: Run Once for All Items
//
// Compatible with the balanced per-account crawl architecture.
// Gets the account lookup from Fetch Pilot Accounts rather than the old
// single-config builder node.

const accounts = $("Fetch Pilot Accounts")
  .all()
  .map(i => ({
    id: i.json.id,
    company_name: i.json.company_name,
    website_url: i.json.website_url,
    normalized_domain: i.json.normalized_domain
  }));

const MAX_CONTENT_CHARS = 30000;

function clean(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function normalizeHostname(value) {
  const raw = clean(value);
  if (!raw) return null;

  try {
    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
      ? raw
      : `https://${raw}`;

    return new URL(candidate).hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .replace(/\.$/, "");
  } catch {
    let s = raw
      .toLowerCase()
      .replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
      .replace(/^\/\//, "")
      .split(/[/?#]/)[0]
      .replace(/:\d+$/, "")
      .replace(/^www\./, "")
      .replace(/\.$/, "");

    return s || null;
  }
}

function pageUrl(p) {
  return clean(
    p?.crawl?.loadedUrl ??
    p?.loadedUrl ??
    p?.url
  );
}

function pageDepth(p) {
  const raw = p?.crawl?.depth ?? p?.depth;
  if (raw === undefined || raw === null || raw === "") return null;

  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function observedAt(p) {
  return clean(
    p?.crawl?.loadedTime ??
    p?.loadedTime ??
    p?.fetchedAt ??
    p?.crawledAt
  ) || new Date().toISOString();
}

function titleOf(p) {
  return clean(
    p?.metadata?.title ??
    p?.title
  );
}

function cap(text) {
  const value = clean(text);

  if (!value) {
    return {
      value: null,
      truncated: false,
      original_chars: 0
    };
  }

  return {
    value: value.slice(0, MAX_CONTENT_CHARS),
    truncated: value.length > MAX_CONTENT_CHARS,
    original_chars: value.length
  };
}

let pages = [];

for (const item of items) {
  const value = item.json;

  if (Array.isArray(value)) {
    pages.push(...value);
  } else if (Array.isArray(value?.data)) {
    pages.push(...value.data);
  } else {
    pages.push(value);
  }
}

return pages.map((p) => {
  const sourceUrl = pageUrl(p);
  const host = normalizeHostname(sourceUrl);

  const account = accounts.find((a) => {
    const domain = normalizeHostname(a.normalized_domain);

    if (!domain || !host) return false;

    return host === domain || host.endsWith(`.${domain}`);
  }) || null;

  const textCap = cap(p?.text);
  const markdownCap = cap(p?.markdown);

  return {
    json: {
      research_version: "WI-V1A.2.0",

      account_match_status: account ? "matched" : "unmatched",
      account_id: account?.id ?? null,
      company_name: account?.company_name ?? null,
      normalized_domain: account?.normalized_domain ?? null,

      source_url: sourceUrl,
      source_hostname: host,

      source_type: "website",
      source_provider: "apify_website_content_crawler",
      source_observed_at: observedAt(p),

      page_title: titleOf(p),
      page_depth: pageDepth(p),

      content_text: textCap.value,
      content_markdown: markdownCap.value,

      content_truncated:
        textCap.truncated || markdownCap.truncated,

      text_original_chars: textCap.original_chars,
      markdown_original_chars: markdownCap.original_chars,

      crawl_metadata: {
        url: clean(p?.url),
        loaded_url: clean(p?.crawl?.loadedUrl ?? p?.loadedUrl),
        canonical_url: clean(
          p?.metadata?.canonicalUrl ??
          p?.canonicalUrl
        ),
        description: clean(
          p?.metadata?.description ??
          p?.description
        ),
        language_code: clean(
          p?.metadata?.languageCode ??
          p?.languageCode
        ),
        referrer_url: clean(
          p?.crawl?.referrerUrl ??
          p?.referrerUrl
        )
      }
    }
  };
});
