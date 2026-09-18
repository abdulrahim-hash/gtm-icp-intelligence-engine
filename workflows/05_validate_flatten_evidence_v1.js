// n8n Code node: Validate & Flatten Website Evidence V1
// Mode: Run Once for All Items
//
// Input: Claude Messages API responses.
// Output: one item containing a batch of idempotent Supabase evidence rows.

const RESEARCH_VERSION = "WI-V1B.0.0";
const MODEL = "claude-sonnet-4-6";

const valueDomains = {
  commercial_focus:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  recurring_janitorial:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  office_cleaning:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  facility_types:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  quote_estimate_motion:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  walkthrough_signal:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  residential_focus:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  service_area_scope:
    new Set(["local", "regional", "multi_region", "national", "unknown"]),
  enterprise_scale_signal:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  franchise_signal:
    new Set(["strong", "moderate", "weak", "absent", "unknown"]),
  technology_maturity:
    new Set(["high", "medium", "low", "unknown"]),
  lead_capture_maturity:
    new Set(["high", "medium", "low", "unknown"])
};

const packets = $("Build Company Research Packets V1")
  .all()
  .map(i => i.json);

const packetByAccount = new Map(
  packets.map(p => [p.account_id, p])
);

function extractText(response) {
  const blocks = response?.content;
  if (!Array.isArray(blocks)) {
    throw new Error("Claude response has no content array.");
  }

  const textBlock = blocks.find(b => b.type === "text");
  if (!textBlock?.text) {
    throw new Error("Claude response has no text content block.");
  }

  return textBlock.text;
}

function positiveFlag(key, value) {
  if (value === "unknown") return null;
  if (value === "absent") return false;

  // This means evidence for the concept is present.
  // It is not an ICP-positive/negative verdict.
  return true;
}

const rows = [];
const accountSummaries = [];

for (const item of items) {
  const response = item.json;
  const raw = extractText(response);

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(
      `Structured output was not parseable JSON: ${e.message}`
    );
  }

  const packet = packetByAccount.get(parsed.account_id);

  if (!packet) {
    throw new Error(
      `Claude returned unknown account_id: ${parsed.account_id}`
    );
  }

  if (parsed.company_name !== packet.company_name) {
    throw new Error(
      `Company-name mismatch for ${parsed.account_id}`
    );
  }

  const suppliedUrls = new Set(packet.source_urls || []);
  const evidence = parsed.evidence || {};

  for (const [key, domain] of Object.entries(valueDomains)) {
    const e = evidence[key];

    if (!e) {
      throw new Error(
        `Missing evidence key ${key} for ${parsed.company_name}`
      );
    }

    if (!domain.has(e.value)) {
      throw new Error(
        `Invalid value '${e.value}' for ${key} / ${parsed.company_name}`
      );
    }

    const confidence = Number(e.confidence);

    if (
      !Number.isInteger(confidence) ||
      confidence < 0 ||
      confidence > 100
    ) {
      throw new Error(
        `Invalid confidence ${e.confidence} for ${key} / ${parsed.company_name}`
      );
    }

    const sourceUrl =
      typeof e.source_url === "string" && e.source_url.trim()
        ? e.source_url.trim()
        : null;

    if (sourceUrl && !suppliedUrls.has(sourceUrl)) {
      throw new Error(
        `Unsupported source URL for ${key} / ${parsed.company_name}: ${sourceUrl}`
      );
    }

    const sourceDoc = sourceUrl
      ? packet.documents.find(d => d.source_url === sourceUrl)
      : null;

    rows.push({
      account_id: parsed.account_id,

      evidence_type: "website_intelligence",
      evidence_key: key,
      evidence_value: e.value,

      evidence_json: {
        normalized_value: e.value,
        observed_text: e.observed_text || "",
        reason: e.reason || "",
        extraction_model: MODEL,
        research_version: RESEARCH_VERSION,
        packet_page_count: packet.page_count,
        packet_chars: packet.packet_chars
      },

      source_type: "website",
      source_url: sourceUrl,
      source_provider: "company_website_via_apify",
      source_observed_at:
        sourceDoc?.source_observed_at ||
        new Date().toISOString(),

      confidence,
      is_positive: positiveFlag(key, e.value),
      is_current: true,

      research_version: RESEARCH_VERSION,
      evidence_fingerprint:
        `${parsed.account_id}|${RESEARCH_VERSION}|${key}`
    });
  }

  accountSummaries.push({
    account_id: parsed.account_id,
    company_name: parsed.company_name,
    evidence_rows: Object.keys(valueDomains).length
  });
}

return [
  {
    json: {
      research_version: RESEARCH_VERSION,
      model: MODEL,
      accounts_researched: accountSummaries.length,
      evidence_count: rows.length,
      accounts: accountSummaries,
      evidence_rows: rows
    }
  }
];
