# Failure & Recovery Lessons

## Apollo 403
The available Apollo plan rejected People Search. The failed attempt was preserved and the provider strategy moved to Prospeo.

## Narrow search fragility
Early provider queries were too restrictive. The final acquisition design uses company-domain + seniority discovery and local persona classification.

## Prospeo 429
A real enrichment hit a rate limit. The task became retryable, the attempt remained recorded, and retry history was preserved.

## Serialized recovery
Remaining contacts were completed serially with a delay between provider calls. GTM06 FINAL carries this pattern forward.

## HubSpot partial execution
CRM recovery was per contact/task rather than “rerun the whole batch,” preventing duplicate records.

## Broker migration
Credential management was centralized into broker workflows so parent workflows remain credential-free.

Reliability here means knowing what happened, what can be retried and what must never be repeated.
