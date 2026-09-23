# Interview Talking Points

**What did you build?** A GTM control plane rather than one automation. Supabase stores canonical state, n8n orchestrates, providers are adapters.

**What was technically difficult?** Safe re-runs: identity resolution, task keys, retry accounting, CRM idempotency, provider-event dedupe and dispatch-time eligibility.

**Tell me about a failure.** A Prospeo enrichment hit a 429. I preserved the attempt, marked it retryable, isolated the retry, and moved the final design toward serialized enrichment.

**Why not make HubSpot the database?** HubSpot is one target system; canonical GTM state belongs in a provider-neutral store.

**Why is outbound disabled?** The portfolio baseline proves the control plane before activation. Approval and provider live enablement are independent gates.
