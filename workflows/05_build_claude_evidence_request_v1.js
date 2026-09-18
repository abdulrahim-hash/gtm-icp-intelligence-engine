// n8n Code node: Build Claude Evidence Request V1
// Mode: Run Once for Each Item
//
// Uses Claude structured outputs.
// The model extracts source-backed evidence only.
// Final GTM scores are computed later by deterministic rules.

const p = $json;

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
          "A short verbatim source excerpt, at most about 20 words. Use an empty string when evidence is absent or unknown."
      },
      source_url: {
        type: "string",
        description:
          "Exact URL from the supplied documents supporting the finding. Use an empty string if absent or unknown."
      },
      confidence: {
        type: "integer",
        description:
          "Confidence from 0 to 100 based only on supplied website evidence."
      },
      reason: {
        type: "string",
        description:
          "Concise explanation grounded only in the supplied website content."
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

const schema = {
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
  required: [
    "account_id",
    "company_name",
    "evidence"
  ],
  additionalProperties: false
};

const docs = p.documents
  .map((d, i) => {
    return [
      `<document index="${i + 1}">`,
      `<source_url>${d.source_url}</source_url>`,
      `<page_title>${d.page_title || ""}</page_title>`,
      `<document_content>`,
      d.content,
      `</document_content>`,
      `</document>`
    ].join("\n");
  })
  .join("\n\n");

const instructions = `
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
- enterprise_scale_signal: evidence of large/national enterprise scale, many locations, very broad operations, or major corporate infrastructure.
- franchise_signal: evidence that the business is a franchise/franchisor/franchise location.
- technology_maturity: evidence of proprietary technology, portals, dashboards, advanced monitoring, automation, or other material operational technology.
- lead_capture_maturity: quality/sophistication of visible website lead capture: forms, booking, assessment/quote flows, multiple conversion paths, etc.

Rules:

1. Do not use outside knowledge.
2. Do not infer a fact merely because the company name or URL suggests it.
3. "absent" means the supplied pages provide reasonable evidence the concept is not present; use "unknown" when the pages simply do not establish it.
4. For source-backed positive findings, copy only a short excerpt of about 20 words or fewer.
5. source_url must exactly match one of the supplied document URLs.
6. If value is "unknown", observed_text and source_url should normally be empty.
7. Confidence measures confidence in the extracted finding, not whether the account is attractive.
8. Do not calculate Fit, Need, Signal, Confidence, an ICP score, or a buying recommendation.
9. Return the account_id exactly as supplied: ${p.account_id}
10. Return the company_name exactly as supplied: ${p.company_name}
`;

return {
  json: {
    research_version: p.research_version,
    account_id: p.account_id,
    company_name: p.company_name,
    normalized_domain: p.normalized_domain,
    source_urls: p.source_urls,
    documents: p.documents,

    claude_model: "claude-sonnet-4-6",

    claude_request: {
      model: "claude-sonnet-4-6",
      max_tokens: 3500,

      system:
        "You are a precise B2B website research extractor. Your job is to extract source-backed facts from supplied company website pages. Be conservative. Missing evidence is unknown, not a license to infer. Do not score or recommend accounts.",

      messages: [
        {
          role: "user",
          content: instructions
        }
      ],

      output_config: {
        format: {
          type: "json_schema",
          schema
        }
      }
    }
  }
};
