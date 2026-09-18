// n8n Code node: Discovery Gate V1
// Mode: Run Once for All Items
// Rule version: DG-V1.0.0
//
// This is a cheap pre-research gate.
// It does NOT determine final ICP fit.

const RULE_VERSION = 'DG-V1.0.0';

const EXPLICIT_REJECT_CATEGORIES = new Set([
  'dry cleaner',
  'house cleaning service',
  'carpet cleaning service',
  'building restoration service',
]);

const THIRD_PARTY_DOMAINS = new Set([
  'nextdoor.com',
  'readdy.cc',
  'facebook.com',
  'instagram.com',
]);

function clean(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

function evaluate(r) {
  const category = (clean(r.primary_category) || '').toLowerCase();
  const domain = (clean(r.normalized_domain) || '').toLowerCase();

  if (r.permanently_closed === true) {
    return {
      discovery_gate_status: 'reject',
      discovery_gate_reason: 'Google Maps indicates business is permanently closed.',
      qualification_status: 'rejected',
    };
  }

  if (EXPLICIT_REJECT_CATEGORIES.has(category)) {
    return {
      discovery_gate_status: 'reject',
      discovery_gate_reason: 'Primary Google Maps category is an explicit out-of-scope service category.',
      qualification_status: 'rejected',
    };
  }

  if (
    category === 'janitorial service' &&
    domain &&
    !THIRD_PARTY_DOMAINS.has(domain)
  ) {
    return {
      discovery_gate_status: 'pass_to_research',
      discovery_gate_reason: 'Janitorial-service category plus a usable first-party domain; eligible for deeper website research.',
      qualification_status: 'hard_gate_pass',
    };
  }

  if (category === 'janitorial service' && !domain) {
    return {
      discovery_gate_status: 'review',
      discovery_gate_reason: 'Janitorial-service category but no usable domain; manual/public-web review required.',
      qualification_status: 'hard_gate_review',
    };
  }

  if (THIRD_PARTY_DOMAINS.has(domain)) {
    return {
      discovery_gate_status: 'review',
      discovery_gate_reason: 'Domain is a third-party/hosted profile rather than a reliable first-party company domain.',
      qualification_status: 'hard_gate_review',
    };
  }

  return {
    discovery_gate_status: 'review',
    discovery_gate_reason: 'Discovery record is potentially relevant but category/domain evidence is insufficient for automatic research eligibility.',
    qualification_status: 'hard_gate_review',
  };
}

return items.map((item) => {
  const r = item.json || {};
  const result = evaluate(r);

  return {
    json: {
      ...r,
      ...result,
      discovery_gate_version: RULE_VERSION,
      discovery_gated_at: new Date().toISOString(),
    },
  };
});
