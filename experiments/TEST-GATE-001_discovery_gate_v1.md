# TEST-GATE-001 â€” Discovery Gate V1

**Date:** 2026-09-18  
**Rule version:** `DG-V1.0.0`  
**Status:** PASS

## Objective

Validate a deterministic, low-cost pre-research qualification gate on the first real Dallas Google Maps cohort.

The gate is designed to reduce obvious discovery noise before website research, AI extraction, contact enrichment, and outbound.

## Input cohort

```text
39 unique Apify Google Maps accounts
```

## Verified output

```text
pass_to_research: 17
review:           10
reject:           12
```

Percentages:

```text
pass_to_research: 43.6%
review:           25.6%
reject:           30.8%
```

## Lifecycle mapping

```text
pass_to_research -> hard_gate_pass
review           -> hard_gate_review
reject           -> rejected
```

Verified counts:

```text
pass_to_research | hard_gate_pass   | 17
reject           | rejected         | 12
review           | hard_gate_review | 10
```

## Rule logic

### Reject

Reject if:
- Google Maps marks the business permanently closed; or
- the primary category is explicitly out of scope:
  - Dry cleaner
  - House cleaning service
  - Carpet cleaning service
  - Building restoration service

### Pass to research

Pass when:
- primary category is `Janitorial service`;
- a normalized domain exists;
- the domain is not a known third-party/hosted profile.

### Review

Everything else remains review.

Examples include:
- ambiguous `Cleaners` / `Cleaning service` categories;
- janitorial records without a usable domain;
- third-party profile domains.

## Interpretation

`pass_to_research` is intentionally **not** equivalent to final ICP fit.

It means only that cheap structured evidence is sufficient to justify deeper research.

Large/national operators, residential-heavy businesses, franchises, and other unsuitable accounts can still pass this gate and must be handled by downstream research and scoring.

## Result

**PASS**

The rule reduced obvious noise by 30.8% without forcing ambiguous accounts into false positive or false negative decisions.

## Next milestone

Website Intelligence V1 should run first on the 17 `pass_to_research` accounts.

The next layer should capture source-backed evidence about:
- commercial/B2B orientation;
- recurring janitorial/office/facility services;
- facility/customer types;
- quote/estimate/walkthrough motion;
- residential contamination;
- service area;
- organizational-scale clues;
- franchise/national-enterprise signals;
- CRM / lead-capture maturity.
