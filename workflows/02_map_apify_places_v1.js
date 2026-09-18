// n8n Code node: Map Apify Places to Account Payload V1
// Mode: Run Once for All Items
//
// Accepts either:
// - one n8n item per Apify place, OR
// - an item whose JSON value contains an array of places.
//
// Outputs provider-neutral account-ingestion records.
// Deep research/scoring is intentionally NOT done here.

function clean(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function numericOrNull(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function boolOrNull(v) {
  return typeof v === "boolean" ? v : null;
}

function countryFromCode(code) {
  const c = clean(code);
  if (!c) return "United States";
  if (c.toUpperCase() === "US") return "United States";
  return c;
}

// Flatten possible response shapes.
let places = [];

for (const item of items) {
  const value = item.json;

  if (Array.isArray(value)) {
    places.push(...value);
  } else if (Array.isArray(value?.data)) {
    places.push(...value.data);
  } else {
    places.push(value);
  }
}

return places
  .filter((p) => p && clean(p.title))
  .map((p) => {
    const lat = numericOrNull(p.location?.lat ?? p.latitude);
    const lng = numericOrNull(p.location?.lng ?? p.longitude);

    return {
      json: {
        company_name: clean(p.title),
        website_url: clean(p.website),

        google_maps_url: clean(p.url),
        country: countryFromCode(p.countryCode),
        state: clean(p.state),
        city: clean(p.city),
        street_address: clean(p.address),
        postal_code: clean(p.postalCode),

        industry: clean(p.categoryName),
        primary_category: clean(p.categoryName),

        company_phone: clean(p.phoneUnformatted ?? p.phone),
        google_rating: numericOrNull(p.totalScore),
        google_review_count: numericOrNull(p.reviewsCount),

        permanently_closed: boolOrNull(p.permanentlyClosed),
        temporarily_closed: boolOrNull(p.temporarilyClosed),

        latitude: lat,
        longitude: lng,

        discovery_source: "apify_google_maps",
        discovery_source_id: clean(p.placeId),
        source_query: clean(p.searchString),

        // The normalize node preserves this record in source_payload.
        source_payload: p,
        is_test_record: false
      }
    };
  });
