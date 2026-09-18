# n8n Workflows

## Workflow 01 — Account Ingestion

Purpose:

Receive company records from a discovery provider, normalize them, and upsert them into Supabase.

### Expected input

See:

`data/account_ingestion_payload_example.json`

### V1 responsibilities

1. accept one account or a batch;
2. validate `company_name`;
3. normalize website/domain;
4. normalize company name;
5. set `discovery_source`;
6. upsert on `normalized_domain` when available;
7. preserve raw source payload;
8. record processing-run counts;
9. fail visibly instead of silently dropping records.

### Explicit non-goals

The V1 ingestion workflow does **not**:
- decide Fit score;
- call an LLM;
- find contacts;
- send outreach;
- write to GHL.

Those are separate stages so failures remain diagnosable.
