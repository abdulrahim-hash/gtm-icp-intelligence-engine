# ADR-009 — Separate Website Acquisition From AI Evidence Extraction

**Date:** 2026-09-18  
**Status:** Accepted

## Context

The discovery pipeline demonstrated that real provider output must be inspected before downstream rules are locked.

Website Intelligence introduces two distinct failure classes:

1. acquisition failure — website content is missing, noisy, blocked, or incorrectly attributed;
2. extraction failure — the AI interprets valid source content incorrectly.

Combining both in the first experiment would make failures difficult to diagnose.

## Decision

Split Website Intelligence V1 into:

### V1A — Source acquisition

```text
website
→ crawler
→ cleaned text/Markdown
→ account attribution
→ deterministic page ranking
```

### V1B — Evidence extraction

```text
selected page content
→ LLM structured extraction
→ schema validation
→ evidence persistence
```

## Provider choice for V1A

Use Apify's maintained `apify/website-content-crawler` as the first website acquisition adapter.

This is not a permanent vendor dependency. The internal downstream contract is provider-neutral.

## Cost controls

The pilot is limited to:
- five accounts;
- crawl depth 1;
- 25 pages total;
- no AI summaries;
- no screenshots;
- no stored HTML.

## Result required before V1B

Do not build or run the LLM evidence extractor across the cohort until source acquisition quality has been inspected.
