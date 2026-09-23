# Upstream Workflow Notes

## GTM01 — Account Ingestion
Normalizes account identity and builds a deterministic `account_key` from domain, provider source ID, or a conservative location fallback before an idempotent Supabase upsert.

## GTM02 — Google Maps Discovery
Runs a bounded Google Maps discovery batch through Apify, maps provider records into a provider-neutral account payload, normalizes identity, and records processing-run metadata.

## GTM03 — Website Intelligence
Crawls a bounded set of company pages, ranks research pages deterministically, constructs research packets, asks Gemini for structured evidence only, validates quoted evidence against supplied source text, and downgrades unverifiable claims to `unknown`.

## GTM04 — Deterministic Account Scoring
Consumes the Website Intelligence evidence contract and applies deterministic Fit, Need, and Confidence scoring. Signal is intentionally unmeasured in V1 rather than inferred from static website evidence.
