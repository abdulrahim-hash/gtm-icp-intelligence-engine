# ADR-008 — Add Deterministic Discovery Gate Before Research

**Date:** 2026-09-18  
**Status:** Accepted  
**Rule version:** DG-V1.0.0

## Context

The first Dallas Google Maps discovery experiment returned 40 records and produced 39 unique accounts.

The cohort contained:
- 17 strong enough for immediate research under a cheap category/domain rule;
- 10 ambiguous records;
- 12 obvious out-of-scope records.

Sending every discovered record through website research, AI extraction, contact enrichment, and outbound would waste money and reduce data quality.

## Decision

Insert a deterministic pre-research discovery gate between normalization and expensive research.

Outputs:

- `pass_to_research`
- `review`
- `reject`

## Why deterministic

The first gate uses only cheap structured evidence:
- closure state;
- primary Google Maps category;
- normalized domain quality.

No LLM is required.

This keeps:
- behavior reproducible;
- decisions explainable;
- costs low;
- rule changes versionable.

## Non-goal

This gate does not determine final ICP fit.

Company scale, commercial focus, recurring-service evidence, franchise status, GTM maturity, and need are evaluated downstream.
