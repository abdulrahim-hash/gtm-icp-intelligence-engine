# Website Intelligence V1A â€” Source Acquisition Pilot

## Objective

Validate website-content acquisition and account attribution before adding an LLM extractor.

This is intentionally a separate checkpoint.

Pipeline:

```text
5 pass_to_research accounts
        â†“
Apify Website Content Crawler
        â†“
clean website text / Markdown
        â†“
match crawled page â†’ account
        â†“
deterministically rank useful pages
        â†“
inspect quality
```

No evidence rows are written yet.

No Fit / Need / Signal score is created yet.

## Why separate crawling from extraction?

The first live Google Maps experiment showed that inspecting real provider output before building downstream logic prevented us from designing around assumptions.

We apply the same rule here:

1. acquire real website content;
2. inspect page coverage and quality;
3. then lock the evidence-extraction schema/prompt.

## Pilot accounts

The pilot deliberately mixes obvious-looking SMBs and an atypical/larger operator:

- Dallas Commercial Cleaning Co.
- MCC Commercial Cleaning LLC
- C&W Services
- Modern Mop Cleaning Services
- Victory Lab Micro-Cleanâ„¢

Domains:

```text
pilot-company-1.example
pilot-company-2.example
pilot-company-3.example
pilot-company-4.example
pilot-company-5.example
```

## n8n workflow

Create:

`GTM 03 - Website Intelligence V1A Pilot`

Nodes:

```text
Manual Trigger
    â†“
Fetch Pilot Accounts
    â†“
Build Website Crawl Pilot V1
    â†“
Run Apify Website Crawler
    â†“
Map Crawled Pages to Accounts V1
    â†“
Rank Research Pages V1
```

### 1. Fetch Pilot Accounts

HTTP Request.

Method:

`GET`

URL:

`https://YOUR_PROJECT_REF.supabase.co/rest/v1/accounts`

Authentication:

existing `Supabase GTM Secret`

Query parameters:

```text
select
id,company_name,website_url,normalized_domain,discovery_gate_status,qualification_status

discovery_gate_status
eq.pass_to_research

normalized_domain
in.(pilot-company-1.example,pilot-company-2.example,pilot-company-3.example,pilot-company-4.example,pilot-company-5.example)

order
company_name.asc
```

Expected: 5 items.

### 2. Build Website Crawl Pilot V1

Code node.

Mode:

`Run Once for All Items`

Paste:

`workflows/04_build_website_crawl_pilot_v1.js`

Expected: 1 item containing:
- 5-account lookup;
- bounded Actor input.

### 3. Run Apify Website Crawler

HTTP Request.

Method:

`POST`

URL:

`https://api.apify.com/v2/acts/apify~website-content-crawler/run-sync-get-dataset-items`

Authentication:

existing `Apify API Token`

Header:

```text
Content-Type: application/json
```

JSON body expression:

```javascript
{{ $json.actor_input }}
```

The pilot uses:
- adaptive crawling;
- depth 1;
- max 25 pages total;
- robots.txt respected;
- Markdown enabled;
- screenshots/HTML files disabled;
- AI summaries disabled.

### 4. Map Crawled Pages to Accounts V1

Code node.

Mode:

`Run Once for All Items`

Paste:

`workflows/04_map_crawled_pages_to_accounts_v1.js`

Purpose:
- normalize URL/hostname;
- match each page back to its account;
- retain source URL and observation time;
- retain text/Markdown;
- cap very large content payloads.

### 5. Rank Research Pages V1

Code node.

Mode:

`Run Once for All Items`

Paste:

`workflows/04_rank_research_pages_v1.js`

The rule favors:
- homepage;
- commercial/janitorial/office/facility pages;
- services/industries/about pages;
- quote/estimate/contact pages.

It penalizes:
- blog/news;
- privacy/terms;
- careers/login/shop.

Maximum selected pages:

`5 per account`

## Pilot pass conditions

Before building the LLM extractor, verify:

1. all 5 accounts were fetched;
2. at least 4/5 websites produce usable content;
3. at least 90% of selected pages match an account;
4. selected pages contain business-relevant text rather than navigation noise;
5. source URLs are retained;
6. no API token appears in workflow data or GitHub;
7. crawl scope remains bounded.

## What to inspect

For each output item capture:

```text
company_name
source_url
page_title
page_depth
page_relevance_score
text_original_chars
content_truncated
```

Then inspect excerpts of `content_text` or `content_markdown`.

## Next stage

After the crawl pilot passes:

```text
selected website pages
        â†“
LLM evidence extractor
        â†“
strict JSON evidence
        â†“
validation
        â†“
account_evidence upsert
        â†“
human QA
```

The evidence extractor will target:
- commercial_focus;
- recurring_janitorial;
- office_cleaning;
- facility_types;
- quote_estimate_motion;
- walkthrough_signal;
- residential_focus;
- service_area;
- enterprise_scale_signal;
- franchise_signal;
- lead_capture_maturity.

The existing `account_evidence.confidence` constraint is 0â€“100, so extractor confidence values will use that scale.

