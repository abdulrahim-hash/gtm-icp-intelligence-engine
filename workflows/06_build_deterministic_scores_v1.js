// Build Deterministic Scores V1
// n8n Code node
// Mode: Run Once for All Items
//
// Input:
//   account_evidence rows for research_version WI-V1B.0.0-GEMINI
//
// Output:
//   one aggregate item containing:
//   - per-account score summaries
//   - idempotent score_components rows
//
// Philosophy:
//   AI extracts evidence.
//   Deterministic code applies GTM policy.
//
// Higher Fit = structurally closer to initial commercial-cleaning ICP.
// Higher Need = stronger opportunity for CRM / lead-to-contract infrastructure.
// Signal = intentionally unmeasured in V1.
// Higher Confidence = stronger / more complete evidence base.

const RULE_VERSION = "SC-V1.0.0";
const RESEARCH_VERSION = "WI-V1B.0.0-GEMINI";

const EXPECTED_KEYS = [
  "commercial_focus",
  "recurring_janitorial",
  "office_cleaning",
  "facility_types",
  "quote_estimate_motion",
  "walkthrough_signal",
  "residential_focus",
  "service_area_scope",
  "enterprise_scale_signal",
  "franchise_signal",
  "technology_maturity",
  "lead_capture_maturity"
];

function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function flattenInput(n8nItems) {
  const out = [];

  for (const item of n8nItems) {
    const value = item.json;

    if (Array.isArray(value)) {
      out.push(...value);
      continue;
    }

    if (Array.isArray(value?.data)) {
      out.push(...value.data);
      continue;
    }

    out.push(value);
  }

  return out;
}

function normalizeEvidenceJson(value) {
  if (!value) return {};

  if (typeof value === "object") {
    return value;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }

  return {};
}

function scoreLookup(value, mapping, fallback = 0) {
  if (Object.prototype.hasOwnProperty.call(mapping, value)) {
    return mapping[value];
  }

  return fallback;
}

function scalar(points, maxPoints) {
  if (!maxPoints) return null;
  return round2(points / maxPoints);
}

const rawRows = flattenInput(items)
  .filter(row =>
    row &&
    row.account_id &&
    row.evidence_key &&
    row.research_version === RESEARCH_VERSION
  );

if (!rawRows.length) {
  throw new Error(
    `No account_evidence rows found for ${RESEARCH_VERSION}.`
  );
}

// --------------------------------------------------
// Group evidence by account.
// --------------------------------------------------

const groups = new Map();

for (const row of rawRows) {
  if (!groups.has(row.account_id)) {
    groups.set(row.account_id, new Map());
  }

  const accountEvidence = groups.get(row.account_id);

  if (accountEvidence.has(row.evidence_key)) {
    throw new Error(
      `Duplicate evidence key '${row.evidence_key}' for account ${row.account_id}.`
    );
  }

  accountEvidence.set(row.evidence_key, {
    ...row,
    evidence_json: normalizeEvidenceJson(row.evidence_json)
  });
}

const scoreComponents = [];
const summaries = [];

// --------------------------------------------------
// Component helpers.
// --------------------------------------------------

function pushEvidenceComponent({
  accountId,
  dimension,
  key,
  label,
  evidence,
  maxPoints,
  points,
  mappingDescription
}) {
  if (!evidence) {
    throw new Error(
      `Missing evidence for scoring component '${key}' / account ${accountId}.`
    );
  }

  const boundedPoints = round2(
    clamp(points, 0, maxPoints)
  );

  scoreComponents.push({
    account_id: accountId,
    score_dimension: dimension,
    component_key: key,
    component_label: label,
    component_value: scalar(boundedPoints, maxPoints),
    max_points: maxPoints,
    points_awarded: boundedPoints,
    evidence_id: evidence.id || null,
    rule_version: RULE_VERSION,
    reasoning:
      `${evidence.evidence_key}=${evidence.evidence_value}; ` +
      `evidence_confidence=${Number(evidence.confidence ?? 0)}; ` +
      `${mappingDescription}; ` +
      `awarded=${boundedPoints}/${maxPoints}.`
  });

  return boundedPoints;
}

function pushAggregateComponent({
  accountId,
  dimension,
  key,
  label,
  componentValue,
  maxPoints,
  points,
  reasoning
}) {
  const boundedPoints = maxPoints > 0
    ? round2(clamp(points, 0, maxPoints))
    : 0;

  scoreComponents.push({
    account_id: accountId,
    score_dimension: dimension,
    component_key: key,
    component_label: label,
    component_value:
      componentValue === null || componentValue === undefined
        ? null
        : round2(componentValue),
    max_points: maxPoints,
    points_awarded: boundedPoints,
    evidence_id: null,
    rule_version: RULE_VERSION,
    reasoning
  });

  return boundedPoints;
}

// --------------------------------------------------
// Score each account.
// --------------------------------------------------

for (const [accountId, evidenceMap] of groups.entries()) {

  const missing = EXPECTED_KEYS.filter(
    key => !evidenceMap.has(key)
  );

  if (missing.length) {
    throw new Error(
      `Account ${accountId} is missing evidence keys: ${missing.join(", ")}`
    );
  }

  const e = key => evidenceMap.get(key);

  // ==================================================
  // FIT — 100 points total
  // ==================================================

  let fit = 0;

  fit += pushEvidenceComponent({
    accountId,
    dimension: "fit",
    key: "fit_commercial_focus",
    label: "Commercial / B2B cleaning focus",
    evidence: e("commercial_focus"),
    maxPoints: 25,
    points: scoreLookup(
      e("commercial_focus").evidence_value,
      {
        strong: 25,
        moderate: 18,
        weak: 8,
        absent: 0,
        unknown: 0
      }
    ),
    mappingDescription:
      "strong=25, moderate=18, weak=8, absent=0, unknown=0"
  });

  fit += pushEvidenceComponent({
    accountId,
    dimension: "fit",
    key: "fit_recurring_janitorial",
    label: "Recurring janitorial model",
    evidence: e("recurring_janitorial"),
    maxPoints: 20,
    points: scoreLookup(
      e("recurring_janitorial").evidence_value,
      {
        strong: 20,
        moderate: 14,
        weak: 6,
        absent: 0,
        unknown: 0
      }
    ),
    mappingDescription:
      "strong=20, moderate=14, weak=6, absent=0, unknown=0"
  });

  fit += pushEvidenceComponent({
    accountId,
    dimension: "fit",
    key: "fit_office_cleaning",
    label: "Office / workplace cleaning relevance",
    evidence: e("office_cleaning"),
    maxPoints: 15,
    points: scoreLookup(
      e("office_cleaning").evidence_value,
      {
        strong: 15,
        moderate: 10,
        weak: 5,
        absent: 0,
        unknown: 0
      }
    ),
    mappingDescription:
      "strong=15, moderate=10, weak=5, absent=0, unknown=0"
  });

  fit += pushEvidenceComponent({
    accountId,
    dimension: "fit",
    key: "fit_facility_types",
    label: "Defined commercial facility types",
    evidence: e("facility_types"),
    maxPoints: 10,
    points: scoreLookup(
      e("facility_types").evidence_value,
      {
        strong: 10,
        moderate: 7,
        weak: 3,
        absent: 0,
        unknown: 0
      }
    ),
    mappingDescription:
      "strong=10, moderate=7, weak=3, absent=0, unknown=0"
  });

  fit += pushEvidenceComponent({
    accountId,
    dimension: "fit",
    key: "fit_service_area_scope",
    label: "Service-area suitability",
    evidence: e("service_area_scope"),
    maxPoints: 10,
    points: scoreLookup(
      e("service_area_scope").evidence_value,
      {
        local: 10,
        regional: 10,
        multi_region: 6,
        national: 2,
        unknown: 0
      }
    ),
    mappingDescription:
      "local=10, regional=10, multi_region=6, national=2, unknown=0"
  });

  fit += pushEvidenceComponent({
    accountId,
    dimension: "fit",
    key: "fit_residential_compatibility",
    label: "Commercial-vs-residential compatibility",
    evidence: e("residential_focus"),
    maxPoints: 8,
    points: scoreLookup(
      e("residential_focus").evidence_value,
      {
        absent: 8,
        weak: 6,
        moderate: 3,
        strong: 0,
        unknown: 4
      }
    ),
    mappingDescription:
      "absent=8, weak=6, moderate=3, strong=0, unknown=4"
  });

  fit += pushEvidenceComponent({
    accountId,
    dimension: "fit",
    key: "fit_enterprise_size",
    label: "Initial-market size suitability",
    evidence: e("enterprise_scale_signal"),
    maxPoints: 7,
    points: scoreLookup(
      e("enterprise_scale_signal").evidence_value,
      {
        absent: 7,
        weak: 6,
        moderate: 3,
        strong: 0,
        unknown: 4
      }
    ),
    mappingDescription:
      "absent=7, weak=6, moderate=3, strong=0, unknown=4"
  });

  fit += pushEvidenceComponent({
    accountId,
    dimension: "fit",
    key: "fit_franchise_structure",
    label: "Direct-operator structure suitability",
    evidence: e("franchise_signal"),
    maxPoints: 5,
    points: scoreLookup(
      e("franchise_signal").evidence_value,
      {
        absent: 5,
        weak: 4,
        moderate: 2,
        strong: 0,
        unknown: 3
      }
    ),
    mappingDescription:
      "absent=5, weak=4, moderate=2, strong=0, unknown=3"
  });

  fit = round2(fit);

  // ==================================================
  // NEED — 100 points total
  // ==================================================

  let need = 0;

  need += pushEvidenceComponent({
    accountId,
    dimension: "need",
    key: "need_lead_capture_gap",
    label: "Lead-capture improvement opportunity",
    evidence: e("lead_capture_maturity"),
    maxPoints: 30,
    points: scoreLookup(
      e("lead_capture_maturity").evidence_value,
      {
        low: 30,
        medium: 18,
        high: 0,
        unknown: 12
      }
    ),
    mappingDescription:
      "low=30, medium=18, high=0, unknown=12"
  });

  need += pushEvidenceComponent({
    accountId,
    dimension: "need",
    key: "need_technology_gap",
    label: "Revenue-system technology opportunity",
    evidence: e("technology_maturity"),
    maxPoints: 25,
    points: scoreLookup(
      e("technology_maturity").evidence_value,
      {
        low: 25,
        medium: 15,
        high: 0,
        unknown: 10
      }
    ),
    mappingDescription:
      "low=25, medium=15, high=0, unknown=10"
  });

  need += pushEvidenceComponent({
    accountId,
    dimension: "need",
    key: "need_quote_process",
    label: "Quote / estimate process opportunity",
    evidence: e("quote_estimate_motion"),
    maxPoints: 20,
    points: scoreLookup(
      e("quote_estimate_motion").evidence_value,
      {
        strong: 20,
        moderate: 15,
        weak: 8,
        absent: 2,
        unknown: 5
      }
    ),
    mappingDescription:
      "strong=20, moderate=15, weak=8, absent=2, unknown=5"
  });

  need += pushEvidenceComponent({
    accountId,
    dimension: "need",
    key: "need_walkthrough_process",
    label: "Walkthrough / assessment workflow opportunity",
    evidence: e("walkthrough_signal"),
    maxPoints: 15,
    points: scoreLookup(
      e("walkthrough_signal").evidence_value,
      {
        strong: 15,
        moderate: 12,
        weak: 6,
        absent: 0,
        unknown: 4
      }
    ),
    mappingDescription:
      "strong=15, moderate=12, weak=6, absent=0, unknown=4"
  });

  need += pushEvidenceComponent({
    accountId,
    dimension: "need",
    key: "need_recurring_sales_complexity",
    label: "Recurring-contract sales-process complexity",
    evidence: e("recurring_janitorial"),
    maxPoints: 10,
    points: scoreLookup(
      e("recurring_janitorial").evidence_value,
      {
        strong: 10,
        moderate: 7,
        weak: 3,
        absent: 0,
        unknown: 2
      }
    ),
    mappingDescription:
      "strong=10, moderate=7, weak=3, absent=0, unknown=2"
  });

  need = round2(need);

  // ==================================================
  // SIGNAL — intentionally unmeasured in V1
  // ==================================================

  pushAggregateComponent({
    accountId,
    dimension: "signal",
    key: "signal_external_why_now_status",
    label: "External why-now signal coverage",
    componentValue: null,
    maxPoints: 0,
    points: 0,
    reasoning:
      "Signal is intentionally unmeasured in SC-V1.0.0. Website fit/need evidence is not treated as a why-now signal. Future versions will add time-sensitive signals such as hiring, expansion, advertising activity, recent reviews, technology changes, or location growth."
  });

  // ==================================================
  // CONFIDENCE — 100 points total
  // ==================================================

  const evidenceRows = EXPECTED_KEYS.map(
    key => e(key)
  );

  const knownRows = evidenceRows.filter(
    row => row.evidence_value !== "unknown"
  );

  const knownRatio =
    knownRows.length / EXPECTED_KEYS.length;

  const averageEvidenceConfidence =
    evidenceRows.reduce(
      (sum, row) =>
        sum + Number(row.confidence || 0),
      0
    ) / evidenceRows.length;

  const traceableKnownRows =
    knownRows.filter(row => {
      const ej = row.evidence_json || {};
      const observed =
        String(ej.observed_text || "").trim();

      return Boolean(
        row.source_url &&
        observed
      );
    });

  const traceabilityRatio =
    knownRows.length
      ? traceableKnownRows.length /
        knownRows.length
      : 0;

  const downgradedRows =
    evidenceRows.filter(row =>
      row.evidence_json?.validation_status ===
      "downgraded_to_unknown"
    );

  const integrityRatio =
    (EXPECTED_KEYS.length -
      downgradedRows.length) /
    EXPECTED_KEYS.length;

  let confidenceScore = 0;

  confidenceScore += pushAggregateComponent({
    accountId,
    dimension: "confidence",
    key: "confidence_evidence_coverage",
    label: "Known evidence coverage",
    componentValue: knownRatio,
    maxPoints: 40,
    points: knownRatio * 40,
    reasoning:
      `${knownRows.length}/${EXPECTED_KEYS.length} evidence dimensions are known (not unknown).`
  });

  confidenceScore += pushAggregateComponent({
    accountId,
    dimension: "confidence",
    key: "confidence_mean_extraction",
    label: "Mean extraction confidence",
    componentValue:
      averageEvidenceConfidence / 100,
    maxPoints: 30,
    points:
      (averageEvidenceConfidence / 100) *
      30,
    reasoning:
      `Mean evidence confidence is ${round2(averageEvidenceConfidence)}/100 across ${EXPECTED_KEYS.length} dimensions.`
  });

  confidenceScore += pushAggregateComponent({
    accountId,
    dimension: "confidence",
    key: "confidence_source_traceability",
    label: "Source traceability",
    componentValue:
      traceabilityRatio,
    maxPoints: 20,
    points:
      traceabilityRatio * 20,
    reasoning:
      `${traceableKnownRows.length}/${knownRows.length || 0} known evidence rows contain both a source URL and observed source text.`
  });

  confidenceScore += pushAggregateComponent({
    accountId,
    dimension: "confidence",
    key: "confidence_validation_integrity",
    label: "Validation integrity",
    componentValue:
      integrityRatio,
    maxPoints: 10,
    points:
      integrityRatio * 10,
    reasoning:
      `${downgradedRows.length}/${EXPECTED_KEYS.length} evidence dimensions were downgraded by deterministic validation.`
  });

  confidenceScore = round2(
    confidenceScore
  );

  summaries.push({
    account_id: accountId,
    fit_score: fit,
    need_score: need,
    signal_score: null,
    signal_status: "unmeasured",
    confidence_score: confidenceScore,
    known_evidence_dimensions:
      knownRows.length,
    evidence_dimensions:
      EXPECTED_KEYS.length,
    validation_downgrades:
      downgradedRows.length,
    rule_version:
      RULE_VERSION
  });
}

// --------------------------------------------------
// Final invariant checks.
// --------------------------------------------------

const EXPECTED_COMPONENTS_PER_ACCOUNT =
  8 + 5 + 1 + 4;

const expectedComponentCount =
  groups.size *
  EXPECTED_COMPONENTS_PER_ACCOUNT;

if (
  scoreComponents.length !==
  expectedComponentCount
) {
  throw new Error(
    `Score component count mismatch. Expected ${expectedComponentCount}, got ${scoreComponents.length}.`
  );
}

for (const summary of summaries) {
  for (const [name, value] of [
    ["fit_score", summary.fit_score],
    ["need_score", summary.need_score],
    ["confidence_score", summary.confidence_score]
  ]) {
    if (
      value < 0 ||
      value > 100
    ) {
      throw new Error(
        `${name} out of range for ${summary.account_id}: ${value}`
      );
    }
  }
}

return [
  {
    json: {
      rule_version: RULE_VERSION,
      research_version:
        RESEARCH_VERSION,
      accounts_scored:
        summaries.length,
      components_per_account:
        EXPECTED_COMPONENTS_PER_ACCOUNT,
      score_component_count:
        scoreComponents.length,
      summaries,
      score_components:
        scoreComponents
    }
  }
];
