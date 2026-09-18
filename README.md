# Commercial Cleaning GTM Intelligence Engine

**Status:** Project 01 — build phase  
**Commercial offer (working):** RepFlow / Saray commercial-cleaning GTM vertical  
**Type:** Real-world GTM Engineering portfolio project + live customer-acquisition experiment  
**Geography:** United States  
**Vertical:** Commercial cleaning / janitorial services

## One-line summary

A vendor-agnostic GTM system that discovers US commercial-cleaning companies, researches and qualifies them, scores Fit / Need / Signal / Confidence, identifies decision-makers, routes qualified prospects into outbound and GoHighLevel, and measures real commercial results.

## Why this project exists

This is not a tutorial build. The project has two simultaneous objectives:

1. build a real acquisition engine capable of winning commercial-cleaning CRM/GTM customers; and
2. create inspectable evidence of GTM Engineering capability for employers.

Every major decision follows:

**Problem → hypothesis → evidence → decision → implementation → test → finding → iteration → result**

## Commercial offer

The service is not based on reselling locked GHL sub-accounts.

The preferred model is:

- the client controls its CRM environment and business data;
- we implement the revenue system in that environment;
- we document the workflows and integrations;
- the client retains administrative control;
- we can remain as an optional CRM / revenue-systems manager because we continue creating operational value.

### Initial productized service

**Commercial Cleaning Lead-to-Contract System**

Typical scope:

- lead capture and source attribution;
- immediate response;
- missed-call recovery;
- qualification and routing;
- walkthrough / estimate booking;
- opportunity pipeline;
- quote/proposal follow-up;
- dormant-opportunity reactivation;
- integrations;
- reporting;
- selected AI automations;
- optional ongoing CRM operations.

RepFlow/Saray owns the **revenue layer**, not necessarily field-service operations such as crew scheduling, payroll, route planning, inspections, or job costing.

## Project 01 objective

Answer:

> Which US commercial-cleaning companies are most likely to need and purchase our lead-to-contract CRM/revenue-system service?

Then turn that intelligence into a real outbound cohort and measure what happens.

## Current architecture

```text
Account discovery
      ↓
n8n ingestion
      ↓
Supabase / Postgres source of truth
      ↓
Normalization + deduplication
      ↓
Hard ICP gates
      ↓
Website / public-web research
      ↓
FIT score
      ↓
NEED score
      ↓
SIGNAL score
      ↓
CONFIDENCE score
      ↓
Account tier
      ↓
Decision-maker discovery
      ↓
Contact verification
      ↓
Outbound
      ↓
GoHighLevel pipeline
      ↓
Replies / meetings / opportunities / customers
```

### Core stack

| Layer | Current choice |
|---|---|
| Account discovery | Apify / Google Maps and other replaceable sources |
| Orchestration | n8n |
| Source of truth | Supabase / Postgres |
| Research | Company websites + public web + LLM-assisted extraction |
| Scoring | Deterministic code / SQL using structured evidence |
| Contact discovery | Provider-agnostic; Hunter/Apollo/public sources as needed |
| CRM | GoHighLevel |
| Version control | GitHub |
| Documentation | Markdown + architecture diagrams + experiment logs |

**Clay is not a production dependency.** It remains documented as an evaluated prototype/tool.

## Scoring architecture

The system separates four questions:

1. **Fit** — is this structurally the kind of cleaning company we serve?
2. **Need** — does the company appear to have a revenue-system gap we can improve?
3. **Signal** — is there evidence that makes the account more relevant now?
4. **Confidence** — how trustworthy and complete is the evidence?

LLMs may extract or normalize evidence, but the final score should be reproducible rather than an unexplained AI number.

## Portfolio evidence

The finished project should contain:

- Git history showing incremental development;
- research and source register;
- ICP specification;
- architecture diagrams;
- Supabase schema;
- n8n workflow exports with secrets removed;
- scoring specification;
- account and contact data model;
- experiment logs;
- QA / test evidence;
- real outbound cohort;
- observed response/meeting/customer results;
- cost metrics;
- short Loom walkthrough;
- final case study.

## Claims policy

Only measured results may be reported. We will not invent pipeline, meetings, revenue, accuracy, ROI, or customer outcomes.

## Current state

Day-1 research and the first tooling experiment are complete.

The next production milestone is:

**Supabase schema + n8n ingestion + first real account-discovery batch.**

See `CURRENT_STATE.md`.
