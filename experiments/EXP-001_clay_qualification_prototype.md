# EXP-001 — Clay Qualification Prototype

**Date:** 2026-09-18  
**Status:** Complete  
**Purpose:** Test whether Clay should be the core account-intelligence layer and validate early qualification assumptions.

## Test setup

- Sample size: 10 accounts
- Credits before: 1,005
- Credits after: 970
- Credits consumed: 35
- Average test cost: 3.5 credits/account

## Sample accounts

The batch included examples such as:

- Triple S
- Big League Clean
- Pure Commercial Cleaning
- K&D Cleaning
- Trustworthy Cleaning Services
- Babco Building Services
- City Wide Facility Solutions of Metro Atlanta
- Pinnacle Building Services
- Brite Building Services
- RamClean

## Findings

### F1 — Industry taxonomy is not sufficient

Triple S appeared under Janitorial Services but the company description emphasized buying power, logistics, product access, marketing support, sales development, and mentoring. A naive classifier labeled it a direct cleaning operator.

**Implication:** operator type must be established from business-model evidence rather than industry label alone.

### F2 — Company-fit does not equal product-need

Big League Clean is clearly a sophisticated commercial cleaning operator, but its description explicitly references in-house AI software, a client portal, and fast-response infrastructure.

**Implication:** the model needs a separate **Need Score**. A structurally strong ICP can still be a low-priority prospect if it already solved the problem.

### F3 — Employee fields require explicit semantics

The first formula mixed a company-size band with another numeric employee/member field, producing inconsistent size classifications.

**Implication:** schema fields need explicit names, types, sources, and precedence rules.

### F4 — Franchise/location status needs its own treatment

A City Wide local entity can look like a normal regional cleaning company while belonging to a broader network.

**Implication:** distinguish independent operator, local franchise/location, parent franchise/network, supplier/distributor, and facility-management intermediary.

### F5 — Trial constraints conflict with intended system scale

The temporary environment is useful for prototyping but not suitable as the production source of truth for the intended acquisition system.

## Architecture change

Previous scoring concept:

Fit + Signal + Confidence

Revised concept:

**Fit + Need + Signal + Confidence**

## Tooling decision

Clay is not used as the core production dependency.

See `decisions/ADR-005_remove_clay_from_core_architecture.md`.

## Why the experiment was valuable

The 35-credit spend prevented us from scaling flawed assumptions across hundreds of records. It also produced a documented engineering decision and clarified the requirements of the production data model.
