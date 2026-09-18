# Website Intelligence V1A.3 — Cheerio-First Progressive Research

## Reason for V1A.3

Two different problems were observed while piloting website acquisition:

1. a global multi-site crawl budget was dominated by one large site;
2. per-account browser crawls hit external compute/time constraints.

The goal is website intelligence, not maximizing browser automation complexity.

## Decision

Use progressive acquisition:

```text
cheap HTTP crawl (Cheerio)
        ↓
content-quality QA
        ↓
sufficient? ── yes ──→ evidence extraction
        │
        no
        ↓
adaptive browser fallback
```

The official Website Content Crawler supports a raw HTTP/Cheerio mode as its fastest crawling engine. Browser crawling remains available for sites that genuinely need JavaScript rendering.

## Pilot topology

```text
Manual Trigger
    ↓
Fetch Pilot Accounts
    ↓
Build Website Crawl Jobs V1.3
    ↓
Loop Over Items (Batch Size = 1)
    ├── Run Apify Website Crawler
    │       ↓
    │   back to Loop
    │
    └── done
          ↓
Map Crawled Pages to Accounts V1.1
          ↓
Rank Research Pages V1
          ↓
Website Crawl QA V1.3
```

## Actor request

Keep the Website Content Crawler synchronous endpoint for the Cheerio pilot:

```text
POST
https://api.apify.com/v2/acts/apify~website-content-crawler/run-sync-get-dataset-items
```

Query parameter:

```text
memory = 1024
```

Body:

```javascript
{{ $json.actor_input }}
```

The builder configures:

```text
crawlerType = cheerio
maxCrawlDepth = 1
maxCrawlPages = 5
maxResults = 5
initialConcurrency = 1
maxConcurrency = 1
```

## QA

`Website Crawl QA V1.3` marks an account for adaptive fallback when:

- zero pages are mapped; or
- zero useful pages are selected; or
- the best selected page contains fewer than 500 characters.

This is intentionally conservative.

## Pass condition

V1A.3 is ready for evidence extraction when:

```text
accounts_with_mapped_pages = 5
accounts_with_selected_pages = 5
unmatched_pages ≈ 0
```

Accounts can still be marked `fallback_required`; those accounts are simply sent through the browser fallback later.

The extraction layer must also use evidence completeness/confidence so missing website coverage does not become a false negative.

## Engineering principle

Use the cheapest reliable acquisition method first.

Escalate expensive browser rendering only when the evidence says it is necessary.
