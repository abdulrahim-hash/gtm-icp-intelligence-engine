# Scoring Model V0 — Design Before Weights

The model intentionally separates **Fit**, **Timing/Signal**, and **Confidence**. Final weights will not be locked until the manual cohort has been reviewed.

## 1. Hard Gate

Boolean. A failed gate prevents expensive enrichment.

Suggested fields:

- `gate_us_market`
- `gate_commercial_primary`
- `gate_recurring_janitorial`
- `gate_active_domain`
- `gate_plausible_buyer`
- `gate_not_enterprise`
- `gate_not_residential_primary`
- `hard_gate_pass`

## 2. Fit Score (0–100)

Candidate dimensions:

- commercial specialization;
- recurring-contract sales motion;
- company/business maturity;
- geographic/service-area complexity;
- sales/GTM complexity;
- service breadth / facility vertical breadth;
- implementation affordability proxy.

Do not assign final weights until labelled evaluation.

## 3. Signal Score (0–100)

Candidate signals:

- sales/BD hiring;
- geographic expansion;
- multi-location expansion;
- new service/industry expansion;
- active demand-generation investment;
- CRM/automation-related hiring or tooling change.

Signals should decay over time where dates are available.

## 4. Confidence Score (0–100)

Confidence should reflect evidence quality, not commercial attractiveness.

Candidate components:

- verified company/domain identity;
- number of independent supporting sources;
- freshness of signal;
- structured vs inferred data;
- confidence of technology/CRM inference;
- decision-maker/contact verification.

## 5. Priority State

Proposed output states:

- `REJECTED`
- `RESEARCH_REQUIRED`
- `TIER_C`
- `TIER_B`
- `TIER_A`
- `CONTACT_PENDING`
- `OUTBOUND_READY`

## 6. Reasoning Trace

Every Tier A/B account should contain:

- top positive fit reasons;
- top negative/uncertain factors;
- active signals;
- evidence confidence;
- recommended persona;
- next action.

This prevents the score from becoming a black box.
