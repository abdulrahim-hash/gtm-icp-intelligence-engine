# 01 — Project Charter

## Project
**GTM ICP Intelligence Engine**

## Portfolio objective
Build a compact but production-minded GTM Engineering system that an employer can inspect quickly and use to evaluate:
- GTM reasoning
- data-system design
- enrichment strategy
- ICP/scoring logic
- signal design
- automation quality
- AI usage
- testing discipline
- documentation quality
- business judgment

## Problem statement
Outbound teams often have access to thousands of potential accounts but limited SDR capacity. A weak system optimizes for list size. A strong system determines which accounts deserve attention, explains why, captures uncertainty, and routes only sufficiently qualified records downstream.

This project will design and test a system that converts a broad account universe into a smaller, prioritized, explainable set of target accounts and contacts.

## Portfolio simulation boundary
This is a portfolio simulation built around a fictional B2B SaaS product. It will **not** claim customer revenue, pipeline, or conversion results that did not occur.

Where real commercial data is unavailable:
- assumptions will be labelled;
- public evidence will be cited;
- system performance will be evaluated against a manually labelled account dataset;
- results will be reported as system/evaluation metrics, not fabricated business outcomes.

## Core system journey
1. Define market and ICP hypothesis
2. Discover candidate accounts
3. Apply low-cost hard exclusions
4. Enrich required firmographic/technographic fields
5. Detect selected observable signals
6. Calculate Fit Score
7. Calculate Signal Score
8. Calculate Data Confidence Score
9. Assign account tier and state
10. Identify relevant buying-committee personas
11. Enrich/verify selected contacts
12. Create an explainable outbound-ready record
13. Route QA failures and low-confidence records to exception queues
14. Measure quality, coverage, and cost
15. Iterate the model from evaluation findings

## In scope
- account sourcing
- enrichment waterfall design
- schema normalization
- hard qualification
- ICP scoring
- signal scoring
- confidence scoring
- tiering
- persona identification
- selected contact enrichment
- data-quality checks
- exception handling
- sample CRM/outbound-ready payload
- testing/evaluation
- cost and coverage measurement
- architecture/documentation

## Explicitly out of scope for Project 01
To prevent feature creep:
- full production CRM deployment
- live high-volume cold email campaigns
- domain/mailbox infrastructure
- complete multi-channel sequencing
- full attribution model
- advanced product-usage intent
- large custom application/front end
- autonomous AI agent allowed to send outreach without review

Those topics can become later portfolio modules.

## Planned stack
The exact stack remains subject to research and cost constraints.

Primary:
- Clay — visible account research/enrichment/scoring workspace
- Apollo / public sources — candidate discovery and contact data as appropriate
- n8n or Make — orchestration only where Clay alone is not the right abstraction
- Python — evaluation, QA, data comparison, or utility scripts when useful
- GitHub — source of truth for project documentation and version history

Potential supporting tools:
- web/search sources
- selected enrichment APIs
- LLM APIs / Claygent
- Supabase only if persistent state adds genuine value

## Build standard
A tool is used only if it has a clear system role. The project should demonstrate judgment about when **not** to add another tool.

## Final inspection path for an employer
1. Read README (2–3 min)
2. View architecture diagram (1 min)
3. Open Clay workspace (3–5 min)
4. Inspect scoring/evaluation evidence (3–5 min)
5. Watch Loom (5–8 min)
6. Dive into decision logs/tests if desired

## Definition of done
The project is done when:
- the business case and ICP assumptions are documented;
- employer-relevant capabilities are mapped;
- sourcing/enrichment/qualification/scoring work end-to-end;
- at least one useful signal family is implemented;
- confidence and exception logic exist;
- a manually labelled evaluation set has been run;
- at least one documented model iteration has occurred;
- coverage and cost are measured;
- the Clay workspace is clean and inspectable;
- GitHub documentation is complete;
- architecture visuals are present;
- a concise Loom walkthrough is recorded;
- no unsupported commercial claims appear in the portfolio.
