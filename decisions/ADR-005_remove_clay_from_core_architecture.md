# ADR-005 — Remove Clay From the Core Production Architecture

**Status:** Accepted  
**Date:** 2026-09-18

## Context

Clay was initially selected as the primary account-discovery, enrichment, qualification, and orchestration layer because it is widely used in GTM Engineering and enables rapid experimentation.

A small prototype was run against ten commercial-cleaning accounts.

The project, however, is intended to become both:
1. a portfolio-grade GTM Engineering system; and
2. a real customer-acquisition engine that can continue operating after a temporary tool trial ends.

## Evidence from EXP-001

The test consumed 35 credits for ten accounts and surfaced useful modeling issues, but the trial/free environment imposed restrictive table visibility/row constraints for the intended workflow.

The experiment also showed that:
- classification logic still required our own domain rules;
- account intelligence needs auditable evidence;
- vendor UI abstractions should not be the system of record;
- the architecture should survive a provider change.

## Decision

Clay is removed from the **core production architecture**.

The production system will use:

- replaceable discovery providers;
- n8n as orchestration;
- Supabase/Postgres as source of truth;
- explicit evidence records;
- deterministic scoring logic;
- provider-agnostic contact discovery;
- GoHighLevel as the sales CRM.

Clay remains valid as an optional enrichment provider or rapid research tool if it provides a future economic advantage.

## Consequences

### Positive
- no dependence on one GTM vendor;
- stronger engineering portfolio evidence;
- full control of schema and scoring logic;
- better auditability;
- easier provider substitution;
- production system can continue without a Clay subscription.

### Negative
- more engineering work;
- we must own retries, normalization, deduplication, and observability;
- individual data providers still have costs and limits.

## Portfolio interpretation

This is not recorded as “Clay failed.”

It is recorded as:

> Clay was evaluated through a bounded prototype. The findings informed a vendor-agnostic architecture better aligned with the project's commercial and engineering requirements.
