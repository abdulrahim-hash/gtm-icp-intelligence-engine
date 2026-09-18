# Website Intelligence V1A.1 — Balanced Crawl Pilot

## Finding from V1A

The first crawl technically covered all five pilot accounts, but one website consumed 22 of 26 mapped pages.

Four accounts received only one page each.

Therefore V1A validated:
- crawling;
- attribution;
- text extraction;
- ranking;

but did not validate balanced evidence coverage.

## New architecture

```text
Fetch 5 pilot accounts
        ↓
Build Balanced Crawl Jobs
        ↓
5 independent Actor executions
        ↓
maximum 5 pages/account
        ↓
Map pages to accounts
        ↓
Rank pages
        ↓
Balanced Crawl QA
```

## n8n changes

Reuse the existing workflow:

`GTM 03 - Website Intelligence V1A Pilot`

Replace:

`Build Website Crawl Pilot V1`

with:

`Build Balanced Website Crawl Jobs V1.1`

Paste:

`workflows/04_build_balanced_website_crawl_jobs_v1_1.js`

Expected output:

`5 items`

Each item contains one account and one Actor input.

Keep the existing:

`Run Apify Website Crawler`

HTTP Request node.

Its JSON body remains:

```javascript
{{ $json.actor_input }}
```

Because the node receives five items, it executes the same bounded crawl request for each account.

Then reuse:

- `Map Crawled Pages to Accounts V1`
- `Rank Research Pages V1`

Replace the temporary QA chain with:

`Balanced Crawl QA V1.1`

Paste:

`workflows/04_balanced_crawl_qa_v1_1.js`

## Pass criteria

```text
accounts_expected = 5
accounts_with_mapped_pages = 5
accounts_with_selected_pages = 5
unmatched_pages = 0 or very low
```

Coverage goal:

- every account should have at least one usable page;
- preferably 2–5 mapped pages for most accounts;
- no single account should consume the entire cohort budget.

A site may legitimately expose only one crawlable page. That alone is not a failure if the page contains enough relevant source text.

## Stop condition

Do not add the LLM extractor until this QA output is inspected.
