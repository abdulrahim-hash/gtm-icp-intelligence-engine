# Workflow 02 — Live Google Maps Discovery V1

## Goal

Run a small real-data discovery experiment for commercial-cleaning companies in Dallas, Texas.

Target:

- search: `commercial cleaning`
- search: `janitorial service`
- location: Dallas, Texas, United States
- cap: 20 places per search
- expected raw maximum before overlap: ~40

The purpose is data-quality validation, **not scale**.

## Why Apify

The production architecture is provider-agnostic. Apify is simply the first discovery adapter.

Actor used:

`compass/crawler-google-places`

The official Actor returns fields such as title, category, address, city, state, website, phone, place ID, Google Maps URL, rating, and review count.

No paid leads enrichment is enabled in this first run.

---

## Apply migration 003

Run:

`sql/003_add_discovery_observability_fields.sql`

Verify:

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'accounts'
  and column_name in (
    'company_phone',
    'primary_category',
    'google_rating',
    'google_review_count',
    'permanently_closed',
    'temporarily_closed',
    'latitude',
    'longitude'
  )
order by column_name;
```

Expected: 8 rows.

Also verify:

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'processing_runs'
  and column_name = 'records_processed';
```

Expected: 1 row.

---

## Create Apify credential in n8n

Create a Header Auth credential:

Name:

`Apify API Token`

Header name:

`Authorization`

Header value:

`Bearer YOUR_APIFY_TOKEN`

The token remains only inside n8n credentials.

---

## Workflow layout

Create:

`GTM 02 - Google Maps Discovery V1`

```text
Manual Trigger
      ↓
Discovery Config - Dallas V1
      ↓
Create Processing Run
      ↓
Run Apify Google Maps
      ↓
Map Apify Places
      ↓
Normalize Account V1.1
      ↓
Supabase Upsert Account
      ↓
Summarize Result
      ↓
Complete Processing Run
```

For this first run, exact created-vs-updated counts are intentionally not claimed unless measured.
We record `records_received` and `records_processed` accurately.

---

## Node 1 — Manual Trigger

Standard Manual Trigger.

---

## Node 2 — Code

Name:

`Discovery Config - Dallas V1`

Mode:

`Run Once for All Items`

Paste:

`workflows/02_discovery_config_dallas_v1.js`

---

## Node 3 — HTTP Request

Name:

`Create Processing Run`

Method:

`POST`

URL:

`https://YOUR_PROJECT_REF.supabase.co/rest/v1/processing_runs?select=id,run_type,status,started_at`

Authentication:

your existing `Supabase GTM Secret` Header Auth credential.

Headers:

```text
Content-Type: application/json
Prefer: return=representation
```

JSON body expression:

```javascript
{{
  {
    run_type: $json.run_type,
    status: "started",
    metadata: {
      market: $json.market,
      location_query: $json.location_query,
      search_strings: $json.search_strings,
      max_places_per_search: $json.max_places_per_search,
      discovery_provider: "apify",
      actor: "compass/crawler-google-places"
    }
  }
}}
```

---

## Node 4 — HTTP Request

Name:

`Run Apify Google Maps`

Method:

`POST`

URL:

`https://api.apify.com/v2/actors/compass~crawler-google-places/run-sync-get-dataset-items`

Authentication:

Header Auth → `Apify API Token`

Headers:

```text
Content-Type: application/json
```

JSON body expression:

```javascript
{{ $("Discovery Config - Dallas V1").first().json.actor_input }}
```

Increase timeout if needed because this synchronous Actor call waits for completion.

Do not put the Apify token in the URL.

---

## Node 5 — Code

Name:

`Map Apify Places`

Mode:

`Run Once for All Items`

Paste:

`workflows/02_map_apify_places_v1.js`

Execute only through this node first and inspect the records.

We expect fields like:

```text
company_name
website_url
google_maps_url
city
state
industry
company_phone
google_rating
google_review_count
discovery_source
discovery_source_id
source_query
```

---

## Node 6 — Code

Name:

`Normalize Account V1.1`

Mode:

`Run Once for All Items`

Paste:

`workflows/01_normalize_account_v1_1.js`

This adds stable account identity.

---

## Node 7 — HTTP Request

Name:

`Supabase Upsert Account`

Use the same proven configuration from Workflow 01.

Method:

`POST`

URL:

`https://YOUR_PROJECT_REF.supabase.co/rest/v1/accounts`

Query:

```text
on_conflict = account_key
select = id,account_key,company_name,normalized_domain,qualification_status,discovery_source
```

Headers:

```text
Content-Type: application/json
Prefer: resolution=merge-duplicates,return=representation
```

JSON body expression:

```javascript
{{ $json }}
```

---

## Node 8 — Code

Name:

`Summarize Result`

Mode:

`Run Once for All Items`

Code:

```javascript
return [
  {
    json: {
      processing_run_id: $("Create Processing Run").first().json.id,
      records_received: $("Map Apify Places").all().length,
      records_processed: items.length,
      status: "success",
      completed_at: new Date().toISOString()
    }
  }
];
```

---

## Node 9 — HTTP Request

Name:

`Complete Processing Run`

Method:

`PATCH`

URL expression:

```javascript
{{
  "https://YOUR_PROJECT_REF.supabase.co/rest/v1/processing_runs?id=eq." +
  $json.processing_run_id
}}
```

Authentication:

`Supabase GTM Secret`

Headers:

```text
Content-Type: application/json
Prefer: return=representation
```

JSON body expression:

```javascript
{{
  {
    status: $json.status,
    records_received: $json.records_received,
    records_processed: $json.records_processed,
    completed_at: $json.completed_at
  }
}}
```

---

## Validation queries

### Inspect run

```sql
select
  id,
  run_type,
  status,
  records_received,
  records_processed,
  records_created,
  records_updated,
  records_rejected,
  started_at,
  completed_at,
  metadata
from public.processing_runs
order by started_at desc
limit 5;
```

### Inspect accounts

```sql
select
  account_key,
  company_name,
  normalized_domain,
  city,
  state,
  primary_category,
  google_rating,
  google_review_count,
  discovery_source,
  qualification_status
from public.accounts
where discovery_source = 'apify_google_maps'
order by google_review_count desc nulls last;
```

### Count

```sql
select count(*) as discovered_accounts
from public.accounts
where discovery_source = 'apify_google_maps';
```

---

## Pass conditions

The first live discovery run passes if:

1. Apify returns real Dallas-area businesses;
2. Mapper produces valid provider-neutral account payloads;
3. normalization generates stable account keys;
4. Supabase stores the rows;
5. no duplicate domain/account key violates the ingestion contract;
6. processing run ends as `success`;
7. `records_received` and `records_processed` match observed workflow data;
8. no credential is stored in GitHub.

Do not start ICP scoring yet.

First inspect whether Google Maps discovery is producing the *right universe*.
