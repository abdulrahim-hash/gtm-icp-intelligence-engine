# Portfolio Summary

Built a provider-agnostic GTM ICP Intelligence Engine with n8n, Supabase, HubSpot and Prospeo, covering account scoring, contact acquisition, identity resolution, verified enrichment, CRM synchronization, controlled outreach, lifecycle handling and QA.

Designed for idempotency and auditability: provider attempts are ledgered, CRM writes resolve to CREATE/UPDATE/NOOP, retries preserve history, and outbound requires fresh eligibility plus human approval.

Pilot validation: 39 scored accounts, 5 fully measured accounts, 7 canonical decision-makers, 7 verified emails, 7 HubSpot mappings and 0 accidental outbound attempts.
