-- 006_website_intelligence_pilot_qa.sql
-- Read-only QA queries for WI-V1B pilot.

-- 1. Evidence volume by pilot account.
select
    a.company_name,
    count(e.id) as evidence_rows
from public.accounts a
left join public.account_evidence e
    on e.account_id = a.id
   and e.research_version = 'WI-V1B.0.0'
where a.normalized_domain in (
    'pilot-company-1.example',
    'pilot-company-2.example',
    'pilot-company-3.example',
    'pilot-company-4.example',
    'pilot-company-5.example'
)
group by a.id, a.company_name
order by a.company_name;

-- Expected: 12 evidence rows per researched account.

-- 2. Human-readable evidence matrix.
select
    a.company_name,
    e.evidence_key,
    e.evidence_value,
    e.confidence,
    e.source_url,
    e.evidence_json ->> 'observed_text' as observed_text,
    e.evidence_json ->> 'reason' as reason
from public.account_evidence e
join public.accounts a
    on a.id = e.account_id
where e.research_version = 'WI-V1B.0.0'
order by a.company_name, e.evidence_key;

-- 3. Any rows with suspicious confidence or missing source for asserted evidence.
select
    a.company_name,
    e.evidence_key,
    e.evidence_value,
    e.confidence,
    e.source_url
from public.account_evidence e
join public.accounts a
    on a.id = e.account_id
where e.research_version = 'WI-V1B.0.0'
  and (
      e.confidence < 0
      or e.confidence > 100
      or (
          e.evidence_value not in ('unknown', 'absent')
          and e.source_url is null
      )
  )
order by a.company_name, e.evidence_key;

-- Expected: zero rows.

