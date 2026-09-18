# Current State

**Date:** 2026-09-18  
**Project:** Commercial Cleaning GTM Intelligence Engine  
**Phase:** Transition from research/prototype to production MVP

## Locked business decisions

- Target vertical: US commercial cleaning / janitorial.
- Initial customer: established local/regional B2B cleaning operators.
- Commercial offer: Lead-to-Contract CRM/revenue system.
- CRM: primarily GoHighLevel.
- Client-control principle: implement in infrastructure the client can control; retain clients through continuing value rather than technical lock-in.
- Optional recurring offer: CRM operations / revenue-systems management.
- Future expansion: once the vertical is repeatable, expand under Saray into broader GTM services and later other verticals.

## Project 01 goal

Build and launch a customer-acquisition MVP, not merely a scoring demo.

Project 01 should eventually cover:

1. account discovery;
2. hard qualification;
3. research;
4. Fit / Need / Signal / Confidence scoring;
5. decision-maker discovery;
6. contact verification;
7. outbound-ready cohort;
8. GHL opportunity pipeline;
9. real outreach;
10. observed results and iteration.

## Clay experiment

A 10-account Clay prototype was run.

- starting credits: 1,005;
- credits after test: 970;
- cost: 35 credits;
- sample: 10 companies.

The experiment exposed:
- semantic classification errors;
- confusion between employee-band and another numeric employee/member field;
- need for franchise/supplier distinctions;
- trial/free table-volume constraints;
- unnecessary vendor dependence for the scale we want.

Decision: Clay will not be the core production architecture.

See `experiments/EXP-001_clay_qualification_prototype.md` and `decisions/ADR-005_remove_clay_from_core_architecture.md`.

## Current production architecture

Discovery provider → n8n → Supabase → research → deterministic scoring → contact discovery → outbound → GoHighLevel.

Providers should be replaceable so the system survives changes in pricing, limits, or vendor availability.

## Immediate next milestone

### M1 — Data foundation

Build:
- Supabase project;
- account table;
- evidence table;
- scoring fields;
- experiment/audit fields;
- n8n account-ingestion workflow;
- deduplication by normalized domain/company/location;
- first 100 real accounts.

No API secret is ever committed to GitHub.
