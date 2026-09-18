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
