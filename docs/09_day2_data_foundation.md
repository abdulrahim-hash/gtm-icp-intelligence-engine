# Day 2 — Data Foundation

## Objective

Create the source-of-truth layer before we begin collecting hundreds of accounts.

Today is complete when:

- a Supabase project exists;
- `001_initial_schema.sql` has executed successfully;
- all seven tables exist;
- RLS is enabled;
- no secret appears in GitHub;
- one test account can be inserted;
- the ingestion payload contract is defined;
- the repository is updated.

## Why this comes before scraping

Without a schema, scraping creates a pile of records.

With a schema, every discovered company enters a defined lifecycle and can retain:
- provenance;
- evidence;
- score components;
- human review;
- outreach outcomes.

## Supabase setup

1. Create a new Supabase project.
2. Open **SQL Editor**.
3. Create a new query.
4. Paste/run `sql/001_initial_schema.sql`.
5. Open **Table Editor** and confirm:
   - accounts
   - account_evidence
   - score_components
   - contacts
   - outreach_events
   - experiments
   - processing_runs

Do not place any Supabase service key inside repository files.

## First smoke test

After the schema is created, run:

```sql
insert into public.accounts (
  company_name,
  normalized_company_name,
  domain,
  normalized_domain,
  city,
  state,
  discovery_source,
  is_test_record
)
values (
  'Project Smoke Test Cleaning Co',
  'project smoke test cleaning co',
  'example.com',
  'example.com',
  'Dallas',
  'Texas',
  'manual_test',
  true
)
returning id, company_name, qualification_status, created_at;
```

Then remove it:

```sql
delete from public.accounts
where is_test_record = true
  and company_name = 'Project Smoke Test Cleaning Co';
```

## Security rule

The repository may contain variable names like:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

It must never contain the real values.

Server-side write credentials will live inside n8n credentials/environment configuration, not Git.

## Next step after schema validation

Build the ingestion workflow:

```text
Webhook / provider output
        ↓
normalize
        ↓
validate
        ↓
derive normalized_domain
        ↓
upsert accounts
        ↓
record processing run
```

The first workflow will intentionally do no deep enrichment. Its only job is to ingest clean company records reliably.
