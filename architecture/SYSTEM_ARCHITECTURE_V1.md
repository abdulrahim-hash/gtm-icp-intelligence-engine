# System Architecture V1

## Objective

Create a vendor-agnostic account-intelligence and acquisition pipeline for commercial-cleaning CRM/GTM customers.

## Logical flow

```text
[Discovery providers]
  Apify / Maps / future source
             |
             v
          [n8n]
  ingestion + normalization
             |
             v
      [Supabase/Postgres]
      source of truth
             |
             +----------------------+
             |                      |
             v                      v
       [Hard gates]          [Evidence store]
             |                      ^
             v                      |
      [Website research]------------+
             |
             v
        [Fit model]
        [Need model]
       [Signal model]
    [Confidence model]
             |
             v
        [Account tier]
             |
             v
 [Decision-maker discovery]
             |
             v
  [Contact verification]
             |
             v
        [Outbound]
             |
             v
       [GoHighLevel]
             |
             v
  [Replies / meetings /
 opportunities / customers]
             |
             v
   [Outcome feedback loop]
```

## Engineering principles

### 1. Source of truth is ours
Provider responses are inputs. Supabase/Postgres holds normalized account state, evidence, scores, and history.

### 2. Evidence before inference
Important classifications should retain source URL, observed fact/text, retrieval time, provider/source, and confidence.

### 3. Deterministic final scoring
AI can extract facts, summarize, or classify evidence, but final score calculation should be reproducible in SQL/code.

### 4. Provider independence
Discovery, contact, and research providers must be replaceable without redesigning the database.

### 5. Progressive enrichment
Cheap/free filters run before expensive research or contact discovery.

### 6. Human-in-the-loop
Borderline accounts go to review instead of forcing a false automated decision.

### 7. Outcome feedback
Real outreach outcomes should later inform scoring and ICP revisions.
