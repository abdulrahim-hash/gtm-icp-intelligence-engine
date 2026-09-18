# Day 3 — Discovery Gate V1

## Why this exists

The first live Dallas discovery run produced:

```text
40 raw records
40 processed
39 unique accounts
```

Observed classification before deeper research:

```text
17 PASS_TO_RESEARCH
10 REVIEW
12 REJECT
```

The raw Google Maps universe therefore has useful recall but meaningful noise.

The discovery gate reduces low-value research spend before:
- crawling websites;
- running LLM extraction;
- finding contacts;
- sending outbound.

## Important boundary

`PASS_TO_RESEARCH` does **not** mean "good ICP."

It means only:

> sufficient cheap evidence exists to justify deeper research.

For example, a very large national facilities company can pass this gate because it is genuinely a janitorial operator with a real website. A later company-fit layer should reject it if it is outside the target segment.

## Rule version

`DG-V1.0.0`

## V1 rules

### Reject

Reject when:
- Google Maps says permanently closed; or
- primary category is:
  - Dry cleaner
  - House cleaning service
  - Carpet cleaning service
  - Building restoration service

### Pass to research

Pass when:
- primary category is `Janitorial service`;
- a normalized domain exists;
- the domain is not a known third-party profile/website host.

### Review

Everything else.

Common reasons:
- ambiguous category (`Cleaning service`, `Cleaners`);
- no first-party website;
- third-party profile rather than company domain.

## Current cohort

Expected after migration:

```text
pass_to_research: 17
review: 10
reject: 12
```

## Production integration

For future discovery runs:

```text
Map provider payload
→ Normalize Account
→ Discovery Gate V1
→ Supabase upsert
```

This ensures the gate is deterministic and versioned at ingestion time.

## Next step

Website Intelligence V1 should start with `pass_to_research` accounts.

Research should determine:
- commercial/B2B orientation;
- recurring janitorial/office/facility services;
- residential contamination;
- service-area evidence;
- target customer/facility types;
- quote / estimate / walkthrough motion;
- organizational scale clues;
- franchise/national-enterprise evidence;
- CRM / lead-capture maturity signals.

The website stage must store evidence, not only an LLM conclusion.
