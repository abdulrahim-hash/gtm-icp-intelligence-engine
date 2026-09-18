# ADR-012 — Progressive Website Acquisition

**Date:** 2026-09-18  
**Status:** Accepted

## Context

Website acquisition encountered:
- unfair page allocation in one multi-site Actor run;
- concurrent Actor memory limits;
- long-running browser requests hitting synchronous gateway limits.

All of these are orchestration concerns, not the core GTM intelligence objective.

## Decision

Adopt a progressive acquisition strategy:

1. Cheerio/raw HTTP crawl first;
2. validate content completeness;
3. use adaptive/Playwright fallback only for low-content or failed sites.

## Rationale

Raw HTTP crawling is:
- faster;
- cheaper;
- lower-memory;
- sufficient for many SMB marketing websites.

Browser rendering is retained as a fallback, not the default.

## Consequence

The system now treats acquisition quality as an explicit confidence dimension rather than assuming every website needs the same expensive crawler.
