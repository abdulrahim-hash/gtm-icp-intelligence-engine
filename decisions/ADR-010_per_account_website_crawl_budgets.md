# ADR-010 — Use Per-Account Website Crawl Budgets

**Date:** 2026-09-18  
**Status:** Accepted

## Context

Website Intelligence V1A used five start URLs inside one Actor run with a global maximum page count.

The run covered all five accounts, but page allocation was highly skewed:

```text
C&W Services: 22 pages
four other accounts: 1 page each
```

The global run-level crawl cap therefore did not provide a fair research budget per account.

## Decision

Run website acquisition as one bounded crawl job per account.

V1.1 pilot:

```text
1 account
→ 1 Actor run
→ maxCrawlDepth = 1
→ maxCrawlPages = 5
```

For five pilot accounts:

```text
maximum target crawl budget = 25 pages
```

## Why

This improves:
- evidence coverage;
- reproducibility;
- cost attribution;
- fairness between small and large websites;
- downstream LLM input quality.

## Tradeoff

Multiple Actor runs introduce a small amount of orchestration overhead.

That cost is accepted because evidence quality is more important than minimizing Actor-run count at this scale.

## Next

Website Intelligence V1B begins only after V1A.1 demonstrates balanced usable content across the pilot cohort.
