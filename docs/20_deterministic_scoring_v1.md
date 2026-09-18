# Deterministic Scoring V1

Rule version:

`SC-V1.0.0`

Research input:

`WI-V1B.0.0-GEMINI`

## Scoring boundaries

The LLM does not score accounts.

The scoring layer consumes validated `account_evidence` and deterministically computes:

- Fit
- Need
- Confidence

Signal is explicitly `unmeasured` in V1.

## Fit

Maximum: 100.

Components:

- commercial focus: 25
- recurring janitorial: 20
- office cleaning relevance: 15
- facility types: 10
- service-area suitability: 10
- residential compatibility: 8
- enterprise-size suitability: 7
- franchise/direct-operator suitability: 5

## Need

Maximum: 100.

Components:

- lead-capture gap: 30
- technology gap: 25
- quote/estimate process opportunity: 20
- walkthrough/assessment workflow opportunity: 15
- recurring-contract sales complexity: 10

Higher Need means the visible business model appears to create more opportunity for the initial CRM / lead-to-contract offer.

It does not mean the company has been proven to have a specific internal CRM problem.

## Signal

V1 deliberately stores one zero-max-point status component.

`signal_score = NULL`

`signal_status = unmeasured`

Website fit or need evidence is not re-labelled as a time-sensitive "why now?" signal.

Future signal research can include:
- hiring;
- expansion;
- new locations;
- recent advertising activity;
- recent review velocity;
- technology changes;
- major website changes;
- other dated public events.

## Confidence

Maximum: 100.

Components:

- known evidence coverage: 40
- mean extraction confidence: 30
- source traceability: 20
- validation integrity: 10

## Idempotency

Logical score component key:

`account_id + score_dimension + component_key + rule_version`

Rerunning the same rule version upserts rather than duplicates.

## Important interpretation

Fit and Need are separate dimensions.

A company can be:
- high Fit / low Need;
- high Fit / high Need;
- low Fit / high Need;
- low Fit / low Need.

Do not collapse these into a single score until real outbound outcomes provide enough evidence to justify a combined prioritization policy.
