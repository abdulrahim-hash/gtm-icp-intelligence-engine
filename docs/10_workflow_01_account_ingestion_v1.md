# Workflow 01 — Account Ingestion V1

## Objective

Prove a reliable, idempotent path from a raw discovery record into the GTM source of truth.

This version intentionally does **not** perform:
- ICP scoring;
- LLM research;
- contact enrichment;
- outbound;
- GoHighLevel writes.

Those are later stages.

## Acceptance criteria

The workflow passes when:

1. two test records are normalized;
2. both are inserted into `accounts`;
3. the domain-based account receives a `domain:` account key;
4. the no-domain account receives a `source:` account key;
5. running the workflow a second time still leaves exactly **two** test rows;
6. raw source payloads are preserved;
7. no secret is present in the workflow export or Git repository.

---

## Step 1 — Apply migration 002

Run:

`sql/002_add_account_key.sql`

in Supabase SQL Editor.

Verify:

```sql
select column_name, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'accounts'
  and column_name = 'account_key';
```

Expected:

```text
account_key | NO
```

---

## Step 2 — Create the n8n credential

In n8n create a credential for the HTTP Request node using **Header Auth**.

Name it something like:

`Supabase GTM Secret`

Header name:

`apikey`

Header value:

your Supabase `sb_secret_...` key.

Do not paste the key into workflow fields, Code nodes, GitHub, screenshots, or documentation.

Supabase secret keys are server-side credentials and bypass RLS.

---

## Step 3 — Create Workflow

Name:

`GTM 01 - Account Ingestion V1`

Create these nodes:

```text
Manual Trigger
      ↓
Generate Test Accounts
      ↓
Normalize Account V1
      ↓
Supabase Upsert Account
```

### Node A — Manual Trigger

Use the standard Manual Trigger.

### Node B — Code

Name:

`Generate Test Accounts`

Mode:

`Run Once for All Items`

Paste:

`workflows/01_generate_test_accounts.js`

### Node C — Code

Name:

`Normalize Account V1`

Mode:

`Run Once for All Items`

Paste:

`workflows/01_normalize_account_v1.js`

Run this node once and inspect the two outputs before continuing.

Expected account keys:

```text
domain:example.com
source:manual-n8n-test:test-002
```

### Node D — HTTP Request

Name:

`Supabase Upsert Account`

Method:

`POST`

URL:

```text
https://YOUR_PROJECT_REF.supabase.co/rest/v1/accounts?on_conflict=account_key&select=id,account_key,company_name,normalized_domain,qualification_status,is_test_record,created_at,updated_at
```

Authentication:

Use the Header Auth credential `Supabase GTM Secret`.

Add headers:

```text
Content-Type: application/json
Prefer: resolution=merge-duplicates,return=representation
```

Body content type:

`JSON`

Body:

Use an expression representing the current item:

```text
{{ $json }}
```

The HTTP Request node processes each incoming n8n item, so the two normalized accounts will be upserted individually.

---

## Step 4 — First database verification

After executing the workflow:

```sql
select
  account_key,
  company_name,
  normalized_domain,
  discovery_source,
  qualification_status,
  is_test_record
from public.accounts
where is_test_record = true
order by company_name;
```

Expected: exactly two rows.

---

## Step 5 — Idempotency test

Execute the exact same n8n workflow again.

Then run:

```sql
select count(*) as test_account_count
from public.accounts
where is_test_record = true;
```

Expected:

```text
2
```

If it returns 4, the upsert contract failed and we stop before using real data.

---

## Step 6 — Cleanup

After evidence/screenshots are captured:

```sql
delete from public.accounts
where is_test_record = true;
```

---

## Security notes

The new Supabase `sb_secret_...` key is appropriate only in controlled backend services. It bypasses RLS.

The Git repository should contain only:
- placeholder variable names;
- sanitized workflow exports;
- code;
- schemas;
- docs.

Never commit the credential value.

---

## Next iteration

After V1 passes, V1.1 will add:
- `processing_runs` observability;
- reject/error capture;
- discovery-provider adapter;
- first real commercial-cleaning account batch.
