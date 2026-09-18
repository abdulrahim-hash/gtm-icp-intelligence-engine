# Website Intelligence V1B — Claude Evidence Extraction

## Goal

Convert selected company website pages into validated, atomic `account_evidence` rows.

Architecture:

```text
Rank Research Pages V1
        ↓
Build Company Research Packets V1
        ↓
Build Claude Evidence Request V1
        ↓
Claude Messages API
        ↓
Validate & Flatten Website Evidence V1
        ↓
Supabase account_evidence upsert
        ↓
human QA
```

## 1. Apply migration 005

Run:

`sql/005_evidence_idempotency.sql`

Verify:

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'account_evidence'
  and column_name in (
    'research_version',
    'evidence_fingerprint'
  )
order by column_name;
```

Expected: 2 rows.

## 2. Add Build Company Research Packets V1

Place after:

`Rank Research Pages V1`

Code node.

Mode:

`Run Once for All Items`

Paste:

`workflows/05_build_company_research_packets_v1.js`

Expected:
- one item per account with selected crawl content;
- maximum 5 pages/account;
- maximum 24,000 source characters/account.

## 3. Add Build Claude Evidence Request V1

Code node.

Mode:

`Run Once for Each Item`

Paste:

`workflows/05_build_claude_evidence_request_v1.js`

The request uses:
- `claude-sonnet-4-6`;
- Messages API;
- JSON structured output;
- no final lead score.

## 4. Create Anthropic credential

In n8n create a Header Auth credential.

Recommended:

```text
Credential name:
Anthropic API Key

Header:
Authorization

Value:
Bearer YOUR_ANTHROPIC_API_KEY
```

Do not paste the key into workflow JSON or GitHub.

## 5. Add Claude HTTP Request

Name:

`Extract Website Evidence - Claude`

Method:

`POST`

URL:

```text
https://api.anthropic.com/v1/messages
```

Authentication:

Header Auth → `Anthropic API Key`

Headers:

```text
anthropic-version = 2023-06-01
Content-Type = application/json
```

Body Content Type:

`JSON`

Body expression:

```javascript
{{ $json.claude_request }}
```

This node should receive one item per research packet.

## 6. Add Validate & Flatten Website Evidence V1

Code node.

Mode:

`Run Once for All Items`

Paste:

`workflows/05_validate_flatten_evidence_v1.js`

Expected pilot output:

```text
accounts_researched: up to 5
evidence_count: accounts_researched × 12
```

For five accounts:

```text
60 evidence rows
```

The validator fails closed if:
- account ID is unexpected;
- company name mismatches;
- a key is missing;
- value is outside its allowed domain;
- confidence is outside 0–100;
- Claude cites a source URL that was not in its research packet.

## 7. Persist evidence

Add HTTP Request:

Name:

`Supabase Upsert Website Evidence`

Method:

`POST`

URL:

```text
https://YOUR_PROJECT_REF.supabase.co/rest/v1/account_evidence
```

Authentication:

existing `Supabase GTM Secret`

Query parameters:

```text
on_conflict = evidence_fingerprint
select = id,account_id,evidence_key,evidence_value,confidence,source_url,research_version
```

Headers:

```text
Content-Type = application/json
Prefer = resolution=merge-duplicates,return=representation
```

Body:

```javascript
{{ $json.evidence_rows }}
```

## 8. Human QA

Run:

`sql/006_website_intelligence_pilot_qa.sql`

Do not score accounts until the evidence matrix has been inspected manually.

## Pass conditions

- every researched account has 12 evidence rows;
- no validator failure;
- no unsupported source URL;
- no confidence outside 0–100;
- positive/asserted findings have traceable source URLs;
- qualitative evidence makes sense on manual inspection;
- rerunning V1B does not duplicate evidence rows.

After this passes, build deterministic Fit / Need / Signal / Confidence V1.
