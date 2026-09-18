# Current State

**Date:** 2026-09-18  
**Project:** Commercial Cleaning GTM Intelligence Engine  
**Phase:** Day 2 â€” production data foundation

## Locked commercial direction

- Market: US commercial cleaning / janitorial.
- Initial customer: established local/regional B2B cleaning operators.
- Offer: Commercial Cleaning Lead-to-Contract System.
- CRM: GoHighLevel.
- Client-control principle: client retains control of its CRM/data; recurring revenue is earned through ongoing CRM/revenue-system management and improvement.
- Longer-term: prove this vertical, then expand broader GTM services under Saray.

## Production stack

- discovery: provider-agnostic; first planned source is Google Maps data through Apify;
- orchestration: n8n;
- source of truth: Supabase/Postgres;
- research: company websites/public web + structured AI extraction;
- scoring: deterministic Fit / Need / Signal / Confidence model;
- contacts: downstream, only after account qualification;
- CRM: GoHighLevel;
- version control: GitHub.

Clay was evaluated in EXP-001 but is not a production dependency.

## Database status

Initial schema validated successfully.

Tables:

- accounts
- account_evidence
- score_components
- contacts
- outreach_events
- experiments
- processing_runs

Migration `002_add_account_key.sql` also passed.

## Workflow status

### GTM 01 â€” Account Ingestion V1

**STATUS: PASS**

Verified:

- company-name normalization;
- website/domain normalization;
- stable `account_key`;
- domain identity;
- discovery-provider-ID fallback identity;
- Supabase upsert;
- repeat-run idempotency;
- zero duplicates on repeated execution;
- `updated_at` behavior.

Evidence:

`experiments/TEST-INGEST-001_idempotent_account_ingestion.md`

Controlled test rows were deleted after verification.

## Immediate next milestone

### Workflow 01 V1.1 â€” Production ingestion observability

Add:

1. processing-run start record;
2. received/created/updated/rejected counters;
3. run completion state;
4. basic failure reporting.

Then connect the first real discovery source and ingest an initial commercial-cleaning cohort without deep enrichment.

No API secret may be committed to GitHub.
