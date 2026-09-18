# TEST-WEB-001 — Website Acquisition V1A

**Date:** 2026-09-18  
**Status:** PARTIAL PASS / ITERATION REQUIRED

## Pilot

Five pass-to-research accounts were crawled using one Website Content Crawler run with five start URLs.

Configuration:

```text
maxCrawlDepth: 1
maxCrawlPages: 25
```

## Observed output

```text
raw crawled pages: 26
mapped pages: 26
selected pages: 9
accounts covered: 5 / 5
```

Observed allocation:

```text
C&W Services:                  22 mapped / 5 selected
Dallas Commercial Cleaning:    1 mapped / 1 selected
MCC Commercial Cleaning:       1 mapped / 1 selected
Modern Mop Cleaning Services:  1 mapped / 1 selected
Victory Lab Micro-Clean:       1 mapped / 1 selected
```

## What passed

- real website content was acquired;
- page → account attribution worked;
- all five pilot accounts were represented;
- useful text/Markdown was extracted;
- deterministic page ranking produced business-relevant pages;
- Victory Lab produced high-quality evidence-ready content.

## What failed

Crawl allocation was heavily imbalanced.

One site consumed almost the entire global page budget, leaving four accounts with only their start page.

This creates biased evidence coverage and is not acceptable as the production research pattern.

## Decision

Do not feed V1A output into the LLM evidence extractor yet.

Create V1A.1 with one bounded crawl job per account:

```text
5 accounts
→ 5 independent Actor runs
→ max 5 pages/account
→ depth 1
```

This preserves the same total target budget while improving account-level fairness and evidence quality.
