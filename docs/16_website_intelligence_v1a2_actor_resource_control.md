# Website Intelligence V1A.2 — Actor Resource Control

## Failure observed

Balanced V1A.1 produced five independent Actor jobs.

n8n attempted multiple jobs concurrently.

The Website Content Crawler run used an 8192 MB default Actor memory allocation.

Two concurrent jobs therefore consumed:

```text
8192 MB + 8192 MB = 16384 MB
```

The third Actor launch failed with:

```text
actor-memory-limit-exceeded
```

## Interpretation

This was not a website-research failure.

It was an orchestration/resource-control failure.

## V1A.2 decision

Use both:

1. one Actor job per account;
2. explicit sequential orchestration in n8n using `Loop Over Items` with batch size `1`.

Additionally, set the Actor API run memory override to:

```text
2048 MB
```

and limit crawler concurrency inside each Actor to:

```text
initialConcurrency = 1
maxConcurrency = 1
```

This is intentionally conservative for a five-page research crawl.

## n8n topology

```text
Fetch Pilot Accounts
    ↓
Build Balanced Website Crawl Jobs V1.2
    ↓
Loop Over Items
Batch Size = 1
    ├── loop → Run Apify Website Crawler
    │              ↓
    │         back to Loop Over Items
    │
    └── done → Map Crawled Pages to Accounts V1.1
                    ↓
              Rank Research Pages V1
                    ↓
              Balanced Crawl QA V1.1
```

## HTTP Request resource parameter

`Run Apify Website Crawler`

Add query parameter:

```text
memory = 2048
```

Keep the existing synchronous endpoint and body expression.

## Important

Before rerunning, verify the prior failed attempt has no Actor runs still in `RUNNING` state in Apify.

Do not upgrade the Apify plan for this pilot.

## Why this is useful portfolio evidence

The failure demonstrates an actual production concern:

```text
fan-out automation
→ provider concurrency/resource ceiling
→ explicit backpressure
→ controlled sequential execution
```

This is recorded as an engineering finding rather than hidden.
