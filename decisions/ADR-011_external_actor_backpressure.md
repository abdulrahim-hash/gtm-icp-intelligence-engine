# ADR-011 — Add Backpressure to External Actor Fan-Out

**Date:** 2026-09-18  
**Status:** Accepted

## Context

Website Intelligence V1A.1 created one Actor run per account.

n8n attempted multiple Actor launches concurrently. With the Actor requesting 8192 MB per run, two jobs exhausted the account-level 16384 MB concurrent Actor memory allowance and the next job returned HTTP 402 / `actor-memory-limit-exceeded`.

## Decision

Introduce explicit backpressure:

```text
Loop Over Items
Batch Size = 1
```

Each account crawl is now executed serially.

Also override the pilot Actor memory to 2048 MB and limit internal crawler concurrency to 1.

## Why

External APIs and compute providers have resource ceilings independent of application logic.

The orchestration layer must control fan-out rather than assume all input items can safely execute concurrently.

## Alternative rejected

Upgrading the Apify plan merely to support five simultaneous five-page pilot crawls.

The pilot does not require that concurrency and the extra capacity would not improve research quality.

## Consequence

The pilot will run slightly longer, but:
- avoids memory-limit failures;
- reduces accidental compute usage;
- makes behavior predictable;
- establishes a reusable backpressure pattern for future enrichment providers.
