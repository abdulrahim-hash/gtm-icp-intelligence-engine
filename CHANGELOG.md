# Changelog

## 2026-09-18 — v0.1.0 — Day 1 Project Definition
### Added
- project charter
- portfolio simulation boundary
- representative employer requirements matrix
- current job-source register
- provisional fictional business scenario
- initial success metrics
- research-question backlog
- architecture decision ADR-001
- Day 1 / Day 2 gate checklist

### Important
No Clay build and no scoring weights have been created yet. This is deliberate: the system must be designed from evidence and explicit hypotheses before tool implementation.

## 2026-09-18 — v0.2.0 — Commercial Use Case Locked
### Changed
- replaced fictional B2B SaaS scenario with real US commercial-cleaning acquisition use case;
- defined RepFlow GHL as a client-controlled CRM implementation and optional management service;
- reframed offer as a Lead-to-Contract Revenue System rather than GHL resale;
- added explicit revenue-layer vs field-service boundary;
- added real outbound validation and real commercial metrics to Project 01;
- added ADR-002 and ADR-003.

### Important
Clay enrichment remains gated behind ICP research and manual company labelling. Real outbound is permitted only as a controlled validation cohort after qualification logic is tested.

## 0.3.0 — 2026-09-18
- Added commercial-cleaning ICP research and hard-gate hypothesis.
- Added 25-company manually researched seed cohort.
- Added six-day / 1,005-credit Clay execution budget.
- Added scoring model V0 separating fit, signal, and confidence.
- Added ADR-004 for budget-first Clay execution.

## 2026-09-18 — v0.4.0 — Vendor-Agnostic Production Architecture
### Added
- EXP-001 documenting the 10-account Clay qualification prototype.
- ADR-005 removing Clay from the core production architecture.
- Fit / Need / Signal / Confidence scoring architecture.
- vendor-agnostic n8n + Supabase architecture.
- current-state handoff and 10-day build plan.
- `.gitignore` and safe `.env.example`.

### Changed
- Clay is now an optional provider/tool rather than the source of truth.
- Project 01 is explicitly a live acquisition MVP with real outbound/results.

## 2026-09-18 â€” Day 2 â€” Account Ingestion V1 Verified

### Added
- stable `account_key` migration for provider-independent upserts;
- n8n account-normalization implementation;
- domain and provider-ID identity strategies;
- TEST-INGEST-001 verification record.

### Verified
- first workflow run inserted two controlled records;
- second identical workflow run kept the row count at two;
- `created_at` remained stable;
- `updated_at` advanced;
- test records were deleted after verification.

### Status
`GTM 01 - Account Ingestion V1` is PASS.

### Next
Add processing-run observability before ingesting real commercial-cleaning account data.

## 2026-09-18 â€” Day 2 â€” First Live Discovery Pipeline Verified

### Added
- discovery/observability migration 003;
- Google Maps discovery configuration;
- Apify place-to-account adapter;
- normalization V1.1;
- Google Maps discovery ADR;
- TEST-DISCOVERY-001 evidence.

### Verified
- Apify returned 40 live Dallas-area records;
- n8n processed all 40;
- Supabase stored 39 unique accounts;
- one duplicate was collapsed through stable account identity/upsert;
- production processing run completed successfully;
- incomplete setup execution was explicitly closed as failed.

### Finding
Google Maps discovery provides useful recall but insufficient precision for direct enrichment/outbound.

The 39-account cohort contained:
- 20 Janitorial service records;
- 12 obvious category mismatches;
- 7 ambiguous Cleaning service / Cleaners records.

### Next
Day 3 starts with a deterministic low-cost discovery gate before website research.
