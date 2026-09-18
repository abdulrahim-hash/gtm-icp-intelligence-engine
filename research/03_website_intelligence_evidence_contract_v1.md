# Website Intelligence Evidence Contract V1

Research version:

`WI-V1B.0.0`

The LLM is an evidence extractor, not a lead scorer.

## Evidence keys

### Fit-oriented facts

- `commercial_focus`
- `recurring_janitorial`
- `office_cleaning`
- `facility_types`
- `residential_focus`
- `service_area_scope`
- `enterprise_scale_signal`
- `franchise_signal`

### Need / process-oriented facts

- `quote_estimate_motion`
- `walkthrough_signal`
- `technology_maturity`
- `lead_capture_maturity`

These categories are descriptive only. The deterministic scoring layer decides later how each fact affects Fit or Need.

## Evidence row contract

Every key produces one versioned row per account.

The idempotency key is:

```text
account_id|WI-V1B.0.0|evidence_key
```

Each row stores:
- normalized value;
- short observed source excerpt;
- exact source URL;
- extraction reason;
- model;
- confidence 0–100;
- research version.

## Important semantics

`is_positive` means:

> evidence for the named concept is present.

It does **not** mean:

> this evidence makes the account a good prospect.

For example:

```text
evidence_key = residential_focus
evidence_value = strong
is_positive = true
```

means strong evidence of residential focus exists. A later Fit rule may assign negative points to that fact.

## Evidence-first scoring boundary

The model must never produce:
- Fit score;
- Need score;
- Signal score;
- Confidence score;
- final ICP score;
- outbound priority;
- buying recommendation.

Those are deterministic downstream computations.
