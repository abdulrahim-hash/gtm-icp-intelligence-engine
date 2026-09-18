# Website Intelligence V1B — Gemini Free-Tier Extraction

## Provider decision

Use:

`gemini-3.1-flash-lite`

for the Website Intelligence V1B pilot.

Why:
- free-tier input/output is available;
- model is stable;
- optimized for high-volume/simple data processing;
- supports structured outputs;
- large context window;
- Gemini API / AI Studio is available in Pakistan.

The free tier may use submitted data to improve Google products. This workflow therefore sends only public company-website content. Do not use this free-tier path for secrets, private client data, credentials, or confidential CRM records.

## Workflow continuation

You have already completed:

`Build Company Research Packets V1`

Continue with:

```text
Build Company Research Packets V1
        ↓
Build Gemini Evidence Request V1
        ↓
Extract Website Evidence - Gemini
        ↓
Validate & Flatten Gemini Evidence V1
        ↓
Supabase Upsert Website Evidence
```

## Create API key

Create a Gemini API key in Google AI Studio.

In n8n create Header Auth:

```text
Name: Gemini API Key
Header: x-goog-api-key
Value: YOUR_GEMINI_API_KEY
```

Never commit the key.

## Gemini HTTP node

Name:

`Extract Website Evidence - Gemini`

Method:

`POST`

URL:

```text
https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent
```

Authentication:

Header Auth → `Gemini API Key`

Header:

```text
Content-Type = application/json
```

Body → JSON → Expression:

```javascript
{{ $json.gemini_request }}
```

## Request builder

Code node:

`Build Gemini Evidence Request V1`

Mode:

`Run Once for Each Item`

Use:

`workflows/05_build_gemini_evidence_request_v1.js`

## Validator

Code node:

`Validate & Flatten Gemini Evidence V1`

Mode:

`Run Once for All Items`

Use:

`workflows/05_validate_flatten_gemini_evidence_v1.js`

Expected:

```text
accounts_researched = number of research packets
evidence_count = accounts_researched * 12
```

Five accounts:

`60 evidence rows`

## Persistence

Reuse the existing `Supabase Upsert Website Evidence` design:

```text
POST
/rest/v1/account_evidence

on_conflict = evidence_fingerprint
```

Body:

```javascript
{{ $json.evidence_rows }}
```

Use the existing Supabase secret credential.

## Research version

Gemini evidence is tagged:

`WI-V1B.0.0-GEMINI`

This prevents mixing it invisibly with the abandoned Claude draft contract.
