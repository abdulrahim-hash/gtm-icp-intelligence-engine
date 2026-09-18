# Checkpoint â€” Website Intelligence + Deterministic Scoring V1

**Checkpoint date:** 2026-09-19

## Current system state

Project 01 has progressed from raw local-market discovery into an explainable GTM intelligence pipeline.

Current architecture:

```text
Google Maps discovery
â†’ deterministic discovery gate
â†’ website acquisition
â†’ page ranking
â†’ Gemini structured evidence extraction
â†’ source / quote validation
â†’ account_evidence
â†’ deterministic Fit / Need / Signal / Confidence scoring
â†’ score_components
```

## Discovery

Dallas commercial-cleaning pilot:

- 40 raw Google Maps results
- 39 unique accounts persisted
- account ingestion verified idempotent
- discovery observability fields persisted

Discovery Gate V1:

- 17 `pass_to_research`
- 10 `review`
- 12 `reject`

Rule version:

`DG-V1.0.0`

The gate is intentionally a research gate, not a final ICP verdict.

## Website Intelligence

The pilot used five companies:

- C&W Services
- Dallas Commercial Cleaning Co.
- MCC Commercial Cleaning LLC
- Modern Mop Cleaning Services
- Victory Lab Micro-Cleanâ„¢

Website acquisition evolved through several engineering findings:

1. A global crawl budget allowed one large website to consume most pages.
2. Per-account browser crawls hit external Actor memory / gateway constraints.
3. The production pattern was changed to progressive acquisition:
   - Cheerio / raw HTTP first
   - browser fallback only where required
4. LLM extraction was separated from website acquisition.

## Evidence Extraction

Provider:

`Google Gemini`

Research version:

`WI-V1B.0.0-GEMINI`

Evidence dimensions per account:

1. commercial_focus
2. recurring_janitorial
3. office_cleaning
4. facility_types
5. quote_estimate_motion
6. walkthrough_signal
7. residential_focus
8. service_area_scope
9. enterprise_scale_signal
10. franchise_signal
11. technology_maturity
12. lead_capture_maturity

Pilot result:

- 5 researched accounts
- 12 evidence dimensions per account
- 60 persisted evidence rows

Important architecture boundary:

> The LLM extracts evidence. It does not assign GTM scores.

Validation checks include:

- account identity
- allowed evidence values
- confidence range
- source URL membership
- quote/source traceability
- field-level downgrade to `unknown` when asserted evidence cannot be verified

Evidence persistence is idempotent through a versioned evidence fingerprint.

## Deterministic Scoring V1

Rule version:

`SC-V1.0.0`

The model deliberately keeps four separate dimensions:

- Fit
- Need
- Signal
- Confidence

Signal is currently:

`unmeasured`

Static website evidence is not mislabeled as a time-sensitive "why now?" signal.

Persisted scoring result:

- 5 accounts
- 18 score components per account
- 90 total score components

### Pilot scores

| Company | Fit | Need | Confidence | Signal |
| --- | ---: | ---: | ---: | --- |
| C&W Services | 77.00 | 67.00 | 75.84 | unmeasured |
| Dallas Commercial Cleaning Co. | 91.00 | 41.00 | 76.67 | unmeasured |
| MCC Commercial Cleaning LLC | 95.00 | 88.00 | 94.17 | unmeasured |
| Modern Mop Cleaning Services | 91.00 | 67.00 | 75.92 | unmeasured |
| Victory Lab Micro-Cleanâ„¢ | 89.00 | 45.00 | 93.67 | unmeasured |

The scoring output demonstrates why Fit and Need remain separate dimensions rather than being collapsed into one opaque score.

## Engineering lessons captured

- Discovery source category labels are not sufficient for ICP qualification.
- Company fit is not the same as product / service need.
- LLMs should normalize ambiguous evidence, not own scoring policy.
- Missing evidence should not automatically become negative evidence.
- External enrichment/crawl systems require explicit backpressure and resource controls.
- Provider-specific extraction should remain replaceable behind a normalized evidence contract.
- Scoring rules must be versioned and reproducible.
- Unknown values currently receive explicit uncertainty priors in some V1 scoring mappings; these should be recalibrated using real outbound outcomes rather than intuition.

## Next stage

Contact Acquisition V1:

```text
scored account
â†’ contact eligibility
â†’ persona / role targeting
â†’ contact discovery
â†’ email / phone verification
â†’ normalized contacts
â†’ outbound-ready gate
â†’ GoHighLevel
â†’ real outbound
â†’ outcome tracking
```

The next database concern is contact identity / idempotency because the current `contacts` table has only the UUID primary key and no natural-key uniqueness constraint.

## Security

API keys, service-role credentials, and provider secrets are not intended to be stored in this repository.

Runtime credentials remain in n8n / provider credential stores.
