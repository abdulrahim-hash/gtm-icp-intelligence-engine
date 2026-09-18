# ADR-006 — Supabase/Postgres as GTM Source of Truth

**Status:** Accepted  
**Date:** 2026-09-18

## Context

Project 01 will combine multiple data providers, website research, AI-assisted extraction, deterministic scoring, contacts, outbound systems, and GoHighLevel.

A provider-native table would couple our data model to a single vendor.

## Decision

Use Supabase/Postgres as the canonical source of truth.

## Rationale

It provides:
- explicit schema;
- relational evidence model;
- reproducible score components;
- provider independence;
- SQL analytics;
- lifecycle tracking;
- auditability;
- integration flexibility with n8n and GHL.

## Consequences

We now own:
- normalization;
- deduplication;
- upserts;
- schema migrations;
- basic observability.

This additional engineering work is accepted because it is directly aligned with the project's portfolio and production objectives.
