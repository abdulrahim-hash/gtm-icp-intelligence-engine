# Architecture

The system has three layers: canonical state in Supabase/Postgres, orchestration in n8n, and external providers behind bounded adapters.

```mermaid
flowchart TB
  W1[GTM01 Ingestion] --> W2[GTM02 Discovery]
  W2 --> W3[GTM03 Website Intelligence]
  W3 --> W4[GTM04 Scoring]
  W4 --> W5[GTM05 Contact Acquisition]
  W5 --> W6[GTM06 Enrichment]
  W6 --> W7[GTM07 CRM Handoff]
  W7 --> W8[GTM08 Outreach]
  W8 --> W9[GTM09 Lifecycle]
  W9 --> W10[GTM10 Reporting]

  DB[(Supabase/Postgres)]
  SB[Supabase RPC Broker V3]
  HB[HubSpot API Broker V2]
  EB[SMTP2GO Email Broker V1]

  W5 --- SB
  W6 --- SB
  W7 --- SB
  W8 --- SB
  W9 --- SB
  W10 --- SB
  SB --- DB
  W7 --- HB
  W8 --- EB
```

## Control gates

- Account eligibility requires complete intelligence/scoring state.
- Persona classification fails closed for excluded roles.
- Canonical identity prefers provider ID, then LinkedIn, verified email, then account-scoped fallback.
- Enrichment permits verified email only; mobile is disabled.
- CRM uses CREATE/UPDATE/NOOP planning and stable mappings.
- Dispatch requires fresh eligibility, no suppression, approved message, claimable task, and live provider.
- Provider calls are immutable attempts for audit purposes.
