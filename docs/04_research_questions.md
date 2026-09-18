# 04 — Research Questions

These questions must be answered before we freeze the scoring model.

## Business / ICP
1. What operational problem does the hypothetical product solve?
2. Which company characteristics plausibly increase that problem's severity?
3. Which characteristics are merely convenient filters rather than meaningful fit indicators?
4. What conditions should cause an immediate disqualification?
5. What company size range gives enough GTM complexity without assuming enterprise procurement?

## Personas
6. Who would own this problem at 50–100, 100–250, and 250–500 employee companies?
7. When does RevOps become a dedicated function?
8. When should VP Sales/CRO be preferred over RevOps as the first persona?
9. Which personas should be explicitly excluded?

## Signals
10. Which public events plausibly indicate increasing GTM complexity?
11. Which signals are too noisy to use?
12. How recent must a signal be to matter?
13. Should signals affect qualification, prioritization, or messaging only?
14. Can each signal be sourced and timestamped?

## Data/enrichment
15. Which fields can Clay/Apollo/public sources provide reliably?
16. Where do providers disagree?
17. What source wins when values conflict?
18. Which fields justify a waterfall?
19. Which expensive enrichment steps can be delayed until after cheap disqualification?
20. What information should be labelled `unknown` instead of inferred?

## Scoring
21. What belongs in Fit Score versus Signal Score?
22. Which factors are gates versus weighted contributions?
23. How will correlated factors avoid double-counting?
24. How will Data Confidence be computed?
25. What thresholds define Tier A/B/C/Nurture/Disqualified?
26. What reasoning trace must accompany every tier?

## Evaluation
27. How will 50+ accounts be manually labelled?
28. What constitutes a severe false positive?
29. Which metric matters most at the outbound-ready threshold: precision, recall, or a weighted trade-off?
30. What change would justify Scoring Model v0.2?

## Portfolio
31. Can an employer understand the system in under 10 minutes?
32. Does every tool have a defensible role?
33. Does the repository show decisions and failures, not only the final state?
34. Are all commercial claims clearly separated from simulation/evaluation results?
