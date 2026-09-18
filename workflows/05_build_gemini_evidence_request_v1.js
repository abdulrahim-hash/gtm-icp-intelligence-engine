// n8n Code node: Build Gemini Evidence Request V1
// Mode: Run Once for Each Item
//
// Input: one company research packet from Build Company Research Packets V1
// Output: Gemini GenerateContent request using JSON Schema structured output.
//
// Model: gemini-3.1-flash-lite
// Research version: WI-V1B.0.0-GEMINI

const p = $json;
const RESEARCH_VERSION = "WI-V1B.0.0-GEMINI";
const MODEL = "gemini-3.1-flash-lite";

const specs = {
  commercial_focus: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  recurring_janitorial: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  office_cleaning: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  facility_types: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  quote_estimate_motion: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  walkthrough_signal: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  residential_focus: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  service_area_scope: [
    "local", "regional", "multi_region", "national", "unknown"
  ],
  enterprise_scale_signal: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  franchise_signal: [
    "strong", "moderate", "weak", "absent", "unknown"
  ],
  technology_maturity: [
    "high", "medium", "low", "unknown"
  ],
  lead_capture_maturity: [
    "high", "medium", "low", "unknown"
  ]
};

function evidenceSchema(values) {
  return {
    type: "object",
    properties: {
      value: {
        type: "string",
        enum: values
      },
      observed_text: {
        type: "string",
        description:
          "Short verbatim excerpt from the supplied website content, about 20 words or fewer. Empty string when unknown."
      },
      source_url: {
        type: "string",
        description:
          "Exact URL from the supplied documents supporting the finding. Empty string when unknown."
      },
      confidence: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description:
          "Confidence in this extraction from 0 to 100, based only on the supplied website evidence."
      },
      reason: {
        type: "string",
        description:
          "Concise explanation grounded only in supplied website content."
      }
    },
    required: [
      "value",
      "observed_text",
      "source_url",
      "confidence",
      "reason"
    ],
    additionalProperties: false
  };
}

const evidenceProperties = {};
for (const [key, values] of Object.entries(specs)) {
  evidenceProperties[key] = evidenceSchema(values);
}

const responseSchema = {
  type: "object",
  properties: {
    account_id: { type: "string" },
    company_name: { type: "string" },
    evidence: {
      type: "object",
      properties: evidenceProperties,
      required: Object.keys(specs),
      additionalProperties: false
    }
  },
  required: ["account_id", "company_name", "evidence"],
  additionalProperties: false
};

const docs = (p.documents || [])
  .map((d, i) => [
    `<document index="${i + 1}">`,
    `<source_url>${d.source_url}</source_url>`,
    `<page_title>${d.page_title || ""}</page_title>`,
    `<document_content>`,
    d.content,
    `</document_content>`,
    `</document>`
  ].join("\n"))
  .join("\n\n");

const prompt = `
<account>
<account_id>${p.account_id}</account_id>
<company_name>${p.company_name}</company_name>
<normalized_domain>${p.normalized_domain || ""}</normalized_domain>
</account>

<documents>
${docs}
</documents>

Analyze only the supplied documents for this company.

Evidence definitions:

- commercial_focus: evidence that the company primarily sells B2B/commercial/facility cleaning.
- recurring_janitorial: evidence of recurring/routine janitorial or ongoing facility-cleaning services.
- office_cleaning: evidence of office/workplace cleaning services.
- facility_types: explicit facility/customer types such as offices, schools, healthcare, industrial, gyms, retail, etc.
- quote_estimate_motion: evidence of a quote, estimate, consultation, assessment, or similar sales CTA.
- walkthrough_signal: evidence of an on-site walkthrough, site survey, facility assessment, inspection, or equivalent pre-sale motion.
- residential_focus: evidence that residential/house/maid cleaning is a material part of the business.
- service_area_scope: infer only from explicit service-area/location evidence: local, regional, multi_region, national, or unknown.
- enterprise_scale_signal: evidence of large/national enterprise scale, many locations, broad operations, or major corporate infrastructure.
- franchise_signal: evidence that the business is a franchise, franchisor, or franchise location.
- technology_maturity: evidence of proprietary technology, portals, dashboards, advanced monitoring, automation, or other material operational technology.
- lead_capture_maturity: sophistication of visible website lead capture: forms, booking, assessment/quote flows, multiple conversion paths, etc.

Rules:

1. Use only supplied documents. Do not use outside knowledge.
2. Do not infer a fact merely from company name or URL.
3. "absent" means supplied pages reasonably establish the concept is not present. Use "unknown" when pages simply do not establish it.
4. For source-backed findings, observed_text must be a short excerpt, about 20 words or fewer.
5. source_url must exactly match a URL in the supplied documents.
6. For "unknown", observed_text and source_url should normally be empty strings.
7. Confidence is confidence in the extraction, not attractiveness of the prospect.
8. Do not calculate Fit, Need, Signal, Confidence, an ICP score, outbound priority, or recommendation.
9. Return account_id exactly as: ${p.account_id}
10. Return company_name exactly as: ${p.company_name}
`;

return {
  json: {
    research_version: RESEARCH_VERSION,
    account_id: p.account_id,
    company_name: p.company_name,
    normalized_domain: p.normalized_domain,
    source_urls: p.source_urls,
    documents: p.documents,

    llm_provider: "google_gemini",
    llm_model: MODEL,

    gemini_request: {
      systemInstruction: {
        parts: [{
          text:
            "You are a precise B2B website research extractor. Extract source-backed facts only. Be conservative: missing evidence is unknown. Do not score or recommend accounts."
        }]
      },
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseJsonSchema: responseSchema
      }
    }
  }
};
