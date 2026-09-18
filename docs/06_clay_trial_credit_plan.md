# Clay Trial Execution Plan — 1,005 Credits / 6 Days

**Goal:** Use the trial to produce a real acquisition asset, not a large but shallow database.

## Key cost principle

Clay list building/prospecting and data cleaning can be free; enrichment and AI research consume credits. Therefore the system should filter aggressively before paid enrichments run.

## Trial objective

By trial expiry, have:

- a focused account universe;
- a validated Tier A/B subset;
- decision makers for the best accounts;
- verified contact data for the best prospects;
- enough research context for personalized outbound;
- exported data so the project remains usable after trial expiry.

## Credit budget (guardrails, not fixed provider costs)

Provider/action costs vary. Always inspect Clay's cost preview before running a column.

| Budget bucket | Max credits | Purpose |
|---|---:|---|
| Account-level enrichment | 220 | Only fields needed to classify fit |
| AI/web research | 180 | Run only on accounts passing cheap gates |
| Decision-maker / people enrichment | 180 | Top Tier A/B accounts only |
| Work-email waterfall / verification | 260 | Only selected decision makers |
| Experiments / reruns | 65 | Scoring or provider tests |
| Emergency reserve | 100 | Coverage gaps / final outbound list |
| **Total** | **1,005** | Hard ceiling |

## Target volumes

These are working limits, not quotas:

1. **Discovery:** 300–600 accounts using free list building/search where possible.
2. **Free pre-filter:** reduce to ~150–220 plausible ICP accounts.
3. **Paid account enrichment:** only the ~100–150 strongest candidates.
4. **Deep research/signals:** only ~50–80 accounts.
5. **Decision makers:** ~40–60 accounts.
6. **Verified emails:** aim for ~30–50 high-confidence outbound-ready prospects.

A smaller, high-quality list is preferable to 1,000 partially enriched rows.

## Rules that protect credits

1. Never enable default enrichments during initial company import unless explicitly required.
2. Never run a paid enrichment on all rows without a conditional run rule.
3. Gate expensive research behind `hard_gate_pass = true`.
4. Gate contact discovery behind `account_tier IN (A, B)`.
5. Gate email enrichment behind `persona_priority <= 2`.
6. Use formulas/data cleaning before paid actions.
7. Use waterfalls for fields where multiple providers improve coverage.
8. Stop a waterfall when a confident result is obtained.
9. Test each paid column on 5–10 rows before scaling.
10. Record estimated and actual credit usage for every paid step.
11. Export all important tables before the trial expires.

## Six-day Clay window

### Trial Day 1
- Build workbook/table structure.
- Import/free-source account universe.
- Apply free filters/formulas.
- Test one or two enrichments on <=10 rows.

### Trial Day 2
- Run account enrichment on gated cohort.
- Calculate first fit model.
- Manually inspect false positives.

### Trial Day 3
- Add research/signal layer to top accounts.
- Create confidence logic.
- Produce Tier A/B list.

### Trial Day 4
- Find priority decision makers.
- Test persona rules and people coverage.

### Trial Day 5
- Run work-email waterfall / verification only for selected people.
- Build outbound-ready table.
- Push/export to GHL/CSV as available.

### Trial Day 6
- Use remaining credits only where evidence says coverage is weak.
- Export every table.
- Capture screenshots and credit metrics.
- Freeze V1 dataset for the case study.

## Metrics to record

- discovered accounts;
- hard-gate pass rate;
- paid-enrichment rows;
- credits consumed by step;
- credits per qualified account;
- Tier A/B account count;
- contact coverage;
- verified-email coverage;
- credits per outbound-ready prospect;
- manual false-positive/false-negative findings.
