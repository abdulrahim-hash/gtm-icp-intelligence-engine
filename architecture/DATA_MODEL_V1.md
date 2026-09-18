# Data Model V1

## Principle

The database is the system of record. Provider responses are inputs, not truth.

## Core entities

### `accounts`

One row per discovered company.

Key responsibilities:
- canonical company identity;
- source metadata;
- qualification state;
- component scores;
- final tier;
- human review;
- lifecycle state.

### `account_evidence`

Stores the facts behind decisions.

Examples:

```text
evidence_type: website_observation
evidence_key: commercial_cleaning_focus
evidence_value: true
source_url: https://example.com/services
confidence: 95
```

or:

```text
evidence_type: technology
evidence_key: customer_portal_detected
evidence_value: true
source_url: https://example.com/client-portal
confidence: 100
```

This prevents the final score from becoming a black box.

### `score_components`

Stores individual scoring rules.

Example:

```text
score_dimension: fit
component_key: commercial_primary
max_points: 20
points_awarded: 20
rule_version: FIT_V1
evidence_id: ...
```

### `contacts`

People are enriched only after the account has qualified.

This is deliberate cost control.

### `outreach_events`

Records actual GTM outcomes instead of claiming them.

Examples:
- email_sent
- reply_positive
- reply_negative
- call_connected
- meeting_booked
- proposal_sent

### `experiments`

Tracks GTM experiments such as:
- scoring V1 vs V2;
- message variant A/B;
- industry subsegment tests;
- geography tests.

### `processing_runs`

Provides basic observability for ingestion/research jobs.

## Identity strategy

Preferred account key:

1. normalized domain;
2. otherwise provider ID;
3. otherwise normalized company + city/state.

The first production ingestion workflow should attempt to normalize a company's website into a domain before upsert.

## Lifecycle

```text
discovered
→ normalized
→ hard_gate_pass / hard_gate_review / rejected
→ research_pending
→ researched
→ scored
→ contact_pending
→ outbound_ready
→ contacted
→ responded
→ meeting_booked
→ proposal
→ won / lost
```

The lifecycle is intentionally explicit so we can inspect where records are leaking.
