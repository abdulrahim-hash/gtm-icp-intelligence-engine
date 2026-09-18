# TEST-DISCOVERY-001 â€” Dallas Google Maps Discovery V1

**Date:** 2026-09-18  
**Status:** TECHNICAL PASS / QUALIFICATION REQUIRED  
**Workflow:** `GTM 02 - Google Maps Discovery V1`

## Objective

Validate the first real account-discovery adapter and prove that real Google Maps business records can move through:

```text
Apify Google Maps
â†’ n8n mapping
â†’ normalization
â†’ stable account identity
â†’ Supabase upsert
â†’ processing-run observability
```

## Discovery configuration

Market:

`US commercial cleaning`

Location:

`Dallas, Texas, United States`

Search strings:

- `commercial cleaning`
- `janitorial service`

Maximum results per search:

`20`

Expected raw maximum:

`40`

No people/contact enrichment was enabled.

## Production run result

Processing run:

`3d05bd8e-f094-4f14-8b82-04725762b524`

Observed:

```text
status: success
records_received: 40
records_processed: 40
unique_accounts_in_supabase: 39
```

One duplicate account was collapsed by the stable account-key/upsert logic.

Duplicate reduction:

`1 / 40 = 2.5%`

## Setup run

Processing run:

`6268f4c1-dd2f-47d2-998a-275244db56e9`

This was an incomplete configuration/test execution and was explicitly closed as:

`failed`

Reason:

`Setup/test run intentionally stopped while Workflow 02 was being configured; no production completion.`

The record was preserved rather than deleted to keep operational history honest.

## Data-quality observation

The 39 unique accounts were not all valid ICP accounts.

Observed primary Google Maps categories:

- 20 `Janitorial service`
- 12 obvious out-of-scope categories:
  - dry cleaner
  - house cleaning service
  - carpet cleaning service
  - building restoration service
- 7 ambiguous `Cleaners` / `Cleaning service` records

This means the discovery source has useful recall but insufficient precision to scale directly into enrichment/outbound.

## Engineering conclusion

**Technical pipeline: PASS**

**Raw discovery precision: requires qualification layer**

The next stage should not scrape more markets yet.

The next stage is a deterministic low-cost discovery gate that:

1. rejects obvious out-of-scope categories;
2. passes strong janitorial candidates with usable domains;
3. sends ambiguous records to review;
4. postpones expensive website research/contact enrichment until after the gate.

## Metric interpretation note

`records_created` and `records_updated` were not measured accurately in V1.1 and therefore remain at their schema defaults.

They must not be interpreted as real zero values in portfolio claims.

A later observability revision can calculate created-vs-updated counts explicitly.
