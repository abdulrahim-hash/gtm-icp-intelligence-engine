# ADR-015 — Separate Fit, Need, Signal, and Confidence

**Date:** 2026-09-18  
**Status:** Accepted

## Decision

Do not create a single opaque lead score in Scoring V1.

Maintain four explicit dimensions:

- Fit
- Need
- Signal
- Confidence

## Fit

Measures structural similarity to the initial ICP.

## Need

Measures evidence-backed opportunity for the current CRM / lead-to-contract offer.

Need is not a claim that an internal operational defect has been proven. Public website evidence is only a proxy until discovery or sales conversations confirm the problem.

## Signal

Measures time-sensitive "why now?" evidence.

Signal is intentionally unmeasured in V1 because the website research completed so far is primarily fit/need evidence.

Using static website fit as a buying signal would create false precision.

## Confidence

Measures evidence completeness and reliability.

## Consequence

Scoring remains interpretable and auditable.

Later, real outbound results can be used to calibrate weights or create a prioritization policy without losing the underlying dimensions.
