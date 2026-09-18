# 03 — Success Metrics

## A. Portfolio success
The project should let an employer verify the following without relying on claims in a CV.

### Evidence targets
- 1 inspectable Clay system
- 1 concise architecture diagram
- 1 data-flow/scoring diagram
- 1 documented data dictionary
- 1 employer-requirement matrix
- 1 source/evidence register
- >= 50 manually reviewed accounts in the evaluation set
- >= 1 documented scoring-model iteration
- QA evidence for important failure paths
- cost/coverage report
- 5–8 minute Loom walkthrough

## B. System-quality metrics
Final thresholds will be locked after Day 2–3 research. Initial evaluation targets:

### Data quality
- Required-field coverage tracked per field/source
- Missing and conflicting values explicitly represented
- Duplicate-account rate measured
- No unknown value silently converted to a positive signal

### Qualification/scoring
- Hard disqualification rules tested deterministically
- Manual labels compared with model output
- Precision/recall or equivalent confusion-matrix measures calculated for the chosen qualification threshold
- Severe false positives manually reviewed
- Fit, signal, and confidence kept separate

### Confidence
A record may not become `OUTBOUND_READY` solely because of a high fit score if critical evidence is missing or untrusted.

### Economics
Track:
- accounts entering system
- accounts disqualified before expensive enrichment
- enrichment operations/credits
- cost per processed account
- cost per qualified account
- provider success/coverage
- cost changes after optimization

## C. Engineering quality
- deterministic naming conventions
- documented source-of-truth rules
- explicit null/unknown handling
- exception queue
- reproducible tests/sample data
- versioned scoring specification
- decision log for non-trivial architecture choices

## D. Claims policy
Allowed:
- measured coverage
- measured agreement with labelled data
- measured credits/cost
- processing success/failure counts
- documented test outcomes

Not allowed unless actually observed in a live commercial deployment:
- revenue generated
- meetings booked
- conversion uplift
- pipeline created
- ROI claims
