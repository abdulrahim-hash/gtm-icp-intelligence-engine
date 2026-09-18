# TEST-INGEST-001 â€” Idempotent Account Ingestion

**Date:** 2026-09-18  
**Status:** PASS  
**Workflow:** `GTM 01 - Account Ingestion V1`

## Objective

Verify that the account-ingestion workflow can ingest normalized company records into Supabase without creating duplicate accounts when the same source records are processed repeatedly.

## Test records

Two controlled test accounts were used.

### Record A â€” domain identity

```text
company_name: GTM Ingestion Test Cleaning One
website_url: https://www.example.com/services
normalized_domain: example.com
account_key: domain:example.com
```

### Record B â€” provider-ID fallback identity

```text
company_name: GTM Ingestion Test Cleaning Two
website_url: null
normalized_domain: null
discovery_source: manual_n8n_test
discovery_source_id: test-002
account_key: source:manual-n8n-test:test-002
```

## Run 1

Expected rows: 2  
Observed rows: 2

Observed account keys:

```text
domain:example.com
source:manual-n8n-test:test-002
```

## Run 2

The exact same workflow and source records were executed again.

Observed count:

```text
test_account_count = 2
```

No duplicate accounts were created.

## Update evidence

The existing rows retained their original `created_at` values while their `updated_at` values advanced on the second run.

This verifies that the second run updated/upserted the existing records instead of inserting new duplicates.

## Result

**PASS**

Validated behaviors:

- domain normalization;
- domain-based stable identity;
- provider-ID fallback identity;
- Supabase upsert using `account_key`;
- duplicate prevention;
- repeat-run idempotency;
- `updated_at` trigger behavior.

## Cleanup

All controlled test records were deleted after verification.

## Engineering implication

The ingestion layer is now safe enough to connect to a real discovery provider. The next version should add processing-run observability before ingesting a production-sized commercial-cleaning cohort.
