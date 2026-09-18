# 01 — Employer Requirements Matrix

## Purpose
This is a **representative current-role sample**, not a statistical survey of the entire GTM Engineering labor market.

Reviewed on **2026-09-18**. The goal is to identify recurring capabilities that Project 01 should visibly demonstrate.

## Sample summary

| Capability | Observed pattern in sampled roles | Project 01 response |
|---|---|---|
| Clay / enrichment systems | Very common | Core Clay workspace + enrichment strategy |
| Scoring / segmentation / signals | Very common | Fit, Signal, Confidence, tiering |
| CRM / data architecture | Common | CRM-ready schema, lifecycle/state model |
| APIs / integrations / orchestration | Common | Use only where required; document boundaries |
| AI / LLM workflows | Very common | Bounded research/classification use cases with QA |
| Outbound infrastructure | Common | Produce outbound-ready records; full sequencing deferred |
| Measurement / experimentation | Very common | Labelled evaluation set + model iteration |
| Documentation / repeatability | Repeated explicitly | README, ADRs, source register, experiment logs |
| Data quality / dedupe / governance | Repeated explicitly | confidence, null handling, exception queue |
| Coding / scripts | Often valued, not universal | Python used where it improves evaluation/QA |

## Representative roles reviewed

| Organization / Role | Notable requirements relevant to this project |
|---|---|
| Attio — Forward Deployed GTM Engineer | CRM architecture/data modeling, APIs/webhooks/JSON/JS, Clay, n8n/Zapier/Make, AI coding tools, ambiguous problem solving |
| ASG — GTM Engineer | Clay-centered enrichment/orchestration/waterfalls, signals/audiences, reporting tied to impact, document every build |
| Speechify / SIMBA — GTM Engineer | sourcing, enrichment, scoring, sequencing, CRM ownership, AI prospect research/personalization |
| Finix — GTM Engineer | HubSpot architecture, enrichment/routing/reporting, APIs, AI qualification/prospecting, QA/anomaly detection, documentation |
| Together AI — GTM Engineer | centralized GTM data, enrichment, dedupe, signal-based workflows, dynamic scoring, APIs/webhooks |
| SecurityScorecard — GTM Engineer | enrichment/signal detection, scoring layers, routing, agent testing, documentation, measurable outcomes |
| Chamelio — Founding GTM Engineer | APIs/webhooks/auth/JSON, Python/JS, LLM workflows, outbound systems, CRM architecture, explain personally built systems |
| Vultr — GTM Engineer | segmentation, Clay, Make/n8n, APIs, routing/scoring, attribution, playbooks/runbooks, experimentation |
| Buildberg — GTM Engineer | Clay enrichment/scoring, n8n pipelines, HubSpot/GHL, email automation, APIs/webhooks/JSON, GitHub |
| Zevenue — GTM Engineer | Clay waterfalls/qualification/scoring, A/B experiments, AI workflows, handoff-ready SOPs/playbooks/experiment briefs |

## Implication for Project 01
The project must not be presented as "I know Clay." It should visibly prove:

> I can take a GTM prioritization problem, define the data model, build enrichment and qualification logic, apply signals and scoring, handle uncertainty, test the output, measure economics, document decisions, and explain the system end to end.

## Source links
See `research/02_source_register.md`.
