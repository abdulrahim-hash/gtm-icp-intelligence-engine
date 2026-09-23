# System Design Decisions

## Supabase is canonical

CRM and enrichment providers are external systems. Their identifiers are recorded, but they do not define canonical GTM state.

## Ledgers instead of implicit state

Acquisition, enrichment, CRM sync and outreach use explicit run/task ledgers with immutable keys, attempt counters, status, payload hashes, retry windows and response metadata.

## Re-runs are a design condition

Identity aliases, deterministic task keys, CRM payload hashes, outreach fingerprints and provider-event keys make re-execution safe.

## Fail closed

Conflicting identity, missing verified email, stale eligibility, suppression, unapproved content or a disabled provider stops progression.

## Human approval is separate from message generation

A render can exist while dispatch remains impossible.

## Cost-aware provider usage

GTM05 and GTM06 have safe read-only validation paths. Live provider calls require explicit operational confirmation.

## Serialized enrichment

A real 429 informed the final design: one enrichment task per controlled invocation, with a 2-second rate guard and preserved retry history.
