# ADR-014 — Use Gemini Free Tier for Website Evidence Extraction

**Date:** 2026-09-18  
**Status:** Accepted for pilot

## Decision

Replace the planned paid Claude extraction call with Google Gemini 3.1 Flash-Lite for Website Intelligence V1B.

## Reasons

The pilot needs:
- structured JSON extraction;
- adequate long context;
- low/no experimental cost;
- easy HTTP integration with n8n.

Gemini 3.1 Flash-Lite provides a free tier and structured outputs and is intended for lightweight/high-volume data-processing tasks.

## Privacy boundary

Google's free tier may use submitted content to improve products.

Therefore this provider path is limited to public website content and non-secret metadata.

It must not be used for:
- credentials;
- private CRM content;
- confidential client documents;
- personal sensitive data.

If the system later processes confidential client material, use an appropriate paid/private provider configuration or a local model.

## Architectural consequence

The intelligence layer remains provider-agnostic.

The persisted evidence records include provider/model/version metadata, so the extraction model can later be swapped and evaluated without changing deterministic scoring policy.
