# ADR-001 — Portfolio Scope and Architecture Principle

**Status:** Accepted  
**Date:** 2026-09-18

## Context
A single large capstone can demonstrate breadth, but it has a long feedback loop and can obscure specific competencies. The portfolio strategy therefore uses smaller, deeply documented GTM systems that can each be inspected independently.

## Decision
Project 01 will be a focused ICP intelligence and scoring system rather than a complete outbound platform.

The architecture will prioritize:
1. explainability over a single opaque AI score;
2. evidence-backed fields over maximal enrichment;
3. cheap qualification before expensive enrichment;
4. separate Fit, Signal, and Confidence scores;
5. explicit unknown/error states;
6. human-labelled evaluation before claiming model quality;
7. documentation as part of the product, not an afterthought.

## Consequences
### Positive
- smaller scope and faster completion;
- clearer interview story;
- easier testing;
- more credible evaluation;
- artifacts can later be reused in the Saray capstone.

### Trade-offs
- no live full-funnel revenue attribution in Project 01;
- no claim of commercial conversion lift;
- some GTME capabilities move to later portfolio modules.

## Revisit condition
Revisit only if research shows that the chosen business scenario cannot produce meaningful observable account signals or reliable evaluation data.
