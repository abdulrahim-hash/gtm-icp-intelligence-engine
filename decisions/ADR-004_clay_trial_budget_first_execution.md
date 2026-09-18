# ADR-004 — Budget-First Clay Trial Execution

**Status:** Accepted  
**Date:** 2026-09-18

## Context

The project has a six-day Clay trial with 1,005 available credits. The objective is to create a real outbound-ready prospect set while also demonstrating cost-aware GTM engineering.

## Decision

Use Clay as an orchestration/enrichment layer after aggressive free/cheap account filtering. Do not use the trial to mass-enrich an unvalidated list.

Paid enrichments must be conditionally gated. Deep research and contact data are reserved for accounts that survive earlier qualification stages.

## Why

This maximizes useful evidence per credit, leaves room for iteration, and creates a portfolio metric that employers can inspect: **credits per qualified/outbound-ready prospect**.

## Consequences

- Initial list size may be smaller.
- More manual validation is required early.
- The project gains a defensible cost architecture.
- Export discipline is mandatory before trial expiration.
