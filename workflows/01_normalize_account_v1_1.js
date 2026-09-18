// n8n Code node: Normalize Account V1.1
// Mode: Run Once for All Items

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

  s = s.trim().toLowerCase();
  s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  s = s.replace(/^\/\//, '');
  s = s.split(/[/?#]/)[0];

  if (s.includes('@')) s = s.split('@').pop();

  s = s.replace(/:\d+$/, '');
  s = s.replace(/^www\./, '');
  s = s.replace(/\.$/, '');

  if (!s || !s.includes('.') || /\s/.test(s)) return null;
  return s;
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

function numberOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function boolOrNull(value) {
  return typeof value === 'boolean' ? value : null;
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
    clean(r.placeId) ??
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

  return {
    json: {
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
      employee_count_estimate: numberOrNull(r.employee_count_estimate),
      founded_year: numberOrNull(r.founded_year),
      company_type: clean(r.company_type),

      company_phone: clean(r.company_phone),
      primary_category: clean(r.primary_category),
      google_rating: numberOrNull(r.google_rating),
      google_review_count: numberOrNull(r.google_review_count),
      permanently_closed: boolOrNull(r.permanently_closed),
      temporarily_closed: boolOrNull(r.temporarily_closed),
      latitude: numberOrNull(r.latitude),
      longitude: numberOrNull(r.longitude),

      qualification_status: 'normalized',

      // Preserve provider-level data for audit/debugging.
      source_payload: r.source_payload ?? r,

      is_test_record: Boolean(r.is_test_record),
    },
  };
});
