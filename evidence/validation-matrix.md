# Validation Matrix

| Boundary | Validation |
|---|---|
| Contact identity | conflicts fail closed |
| Persona | excluded roles rejected |
| Acquisition | one company/seniority search per eligible account |
| Enrichment | verified email only; mobile disabled |
| Rate limit | 429 preserves attempt and retry state |
| CRM | 7 NOOP, 0 writes |
| Messages | 7 deterministic renders, pending approval |
| Send readiness | 0 send-ready rows |
| Provider | live dispatch disabled |
| Lifecycle | delivery/reply/unsubscribe tests idempotent and rollback-safe |
| QA | PRE_SEND_CONTROLLED / all checks green |
| Final audit | immutable baseline frozen |
