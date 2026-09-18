# ADR-013 — LLM Extracts Evidence; Deterministic Code Scores Accounts

**Date:** 2026-09-18  
**Status:** Accepted

## Context

Website content contains ambiguous natural-language evidence that is difficult to extract with simple keyword rules.

However, allowing an LLM to directly assign a final ICP or lead score would make the system:
- difficult to reproduce;
- difficult to audit;
- vulnerable to prompt/model drift;
- harder to explain to operators and employers.

## Decision

Use Claude only to transform bounded source content into structured, source-backed evidence.

Use deterministic SQL/JavaScript rules downstream for:
- Fit;
- Need;
- Signal;
- Confidence;
- tiering.

## Structured outputs

The extraction request uses Claude JSON structured outputs with an explicit schema.

The workflow then independently validates:
- account identity;
- every required evidence key;
- allowed values;
- confidence range;
- source URL membership.

Only validated evidence is persisted.

## Model

Pilot model:

`claude-sonnet-4-6`

The model is versioned in every evidence row through `evidence_json`.

## Principle

AI handles ambiguity.

Code handles policy.
