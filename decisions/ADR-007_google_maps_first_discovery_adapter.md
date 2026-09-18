# ADR-007 — Google Maps as First Discovery Adapter

**Status:** Accepted for V1 experiment  
**Date:** 2026-09-18

## Decision

Use Apify's maintained `compass/crawler-google-places` Actor as the first real account-discovery adapter.

## Why

Commercial cleaning is geographically delivered and heavily represented in local business data. Google Maps can provide:
- business identity;
- website;
- phone;
- location;
- category;
- place ID;
- rating;
- review count.

These fields are useful for discovery and cheap pre-qualification.

## Boundaries

Google Maps is not treated as the ICP truth.

The output is only the top of funnel.

Later stages determine:
- whether the company is actually commercial-first;
- independent/franchise/supplier status;
- fit;
- need;
- signals;
- decision makers.

The architecture remains provider-agnostic; Apify can be replaced without changing the core account schema.
