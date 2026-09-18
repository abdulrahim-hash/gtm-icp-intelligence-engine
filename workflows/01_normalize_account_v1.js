// n8n Code node: Normalize Account V1
// Mode: Run Once for All Items
//
// Input: one or more raw company records.
// Output: canonical account rows suitable for Supabase upsert.
//
// IMPORTANT: This node does NOT score or enrich accounts.

function clean(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

function normalizeCompanyName(value) {
  const s = clean(value);
  if (!s) return null;

  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDomain(value) {
  let s = clean(value);
  if (!s) return null;

  s = s.toLowerCase();

  // Accept a raw domain or a full URL.
  if (!/^https?:\/\//i.test(s)) {
    s = 'https://' + s;
  }

  try {
    const u = new URL(s);
    return u.hostname
      .toLowerCase()
      .replace(/^www\./, '')
      .replace(/\.$/, '');
  } catch {
    return null;
  }
}

function slug(value, fallback) {
  const s = clean(value);
  if (!s) return fallback;

  const result = s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return result || fallback;
}

return items.map((item) => {
  const r = item.json || {};

  const companyName =
    clean(r.company_name) ??
    clean(r.title) ??
    clean(r.name);

  if (!companyName) {
    throw new Error('company_name is required for ingestion');
  }

  const websiteUrl =
    clean(r.website_url) ??
    clean(r.website) ??
    clean(r.url);

  const suppliedDomain = clean(r.domain);
  const normalizedDomain =
    normalizeDomain(suppliedDomain) ??
    normalizeDomain(websiteUrl);

  const discoverySource =
    clean(r.discovery_source) ??
    'manual';

  const discoverySourceId =
    clean(r.discovery_source_id) ??
    clean(r.place_id) ??
    clean(r.source_id);

  const city = clean(r.city);
  const state = clean(r.state);

  let accountKey;

  if (normalizedDomain) {
    accountKey = `domain:${normalizedDomain}`;
  } else if (discoverySourceId) {
    accountKey =
      `source:${slug(discoverySource, 'unknown-source')}:${slug(discoverySourceId, 'unknown-id')}`;
  } else {
    accountKey =
      `fallback:${slug(companyName, 'unknown-company')}:${slug(city, 'unknown-city')}:${slug(state, 'unknown-state')}`;
  }

  const canonical = {
    account_key: accountKey,

    company_name: companyName,
    normalized_company_name: normalizeCompanyName(companyName),

    domain: normalizedDomain,
    normalized_domain: normalizedDomain,
    website_url: websiteUrl,

    linkedin_url: clean(r.linkedin_url),
    google_maps_url: clean(r.google_maps_url),

    country: clean(r.country) ?? 'United States',
    state,
    city,
    street_address: clean(r.street_address ?? r.address),
    postal_code: clean(r.postal_code),

    discovery_source: discoverySource,
    discovery_source_id: discoverySourceId,
    source_query: clean(r.source_query),

    industry: clean(r.industry),
    employee_band: clean(r.employee_band),
    employee_count_estimate:
      Number.isFinite(Number(r.employee_count_estimate))
        ? Number(r.employee_count_estimate)
        : null,
    founded_year:
      Number.isFinite(Number(r.founded_year))
        ? Number(r.founded_year)
        : null,
    company_type: clean(r.company_type),

    qualification_status: 'normalized',

    // Preserve the original provider record for audit/debugging.
    source_payload: r,

    is_test_record: Boolean(r.is_test_record),
  };

  return { json: canonical };
});
