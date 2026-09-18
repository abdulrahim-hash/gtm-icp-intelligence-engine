-- 008_scoring_v1_qa.sql
-- Read-only QA for deterministic scoring rule SC-V1.0.0.

-- 1. Exactly 18 score component rows per scored account.
select
    a.company_name,
    count(sc.id) as component_rows
from public.score_components sc
join public.accounts a
    on a.id = sc.account_id
where sc.rule_version = 'SC-V1.0.0'
group by a.id, a.company_name
order by a.company_name;

-- Expected for the five-account pilot:
-- 18 rows per account.

-- 2. Score summary.
select
    company_name,
    fit_score,
    need_score,
    signal_score,
    signal_status,
    confidence_score,
    component_rows
from public.account_score_summary_v1
where component_rows > 0
order by company_name;

-- 3. Dimension totals and maxima.
select
    a.company_name,
    sc.score_dimension,
    round(sum(sc.points_awarded), 2) as points,
    round(sum(sc.max_points), 2) as max_points,
    count(*) as components
from public.score_components sc
join public.accounts a
    on a.id = sc.account_id
where sc.rule_version = 'SC-V1.0.0'
group by
    a.id,
    a.company_name,
    sc.score_dimension
order by
    a.company_name,
    sc.score_dimension;

-- Expected per account:
-- fit        max_points = 100, components = 8
-- need       max_points = 100, components = 5
-- signal     max_points = 0,   components = 1
-- confidence max_points = 100, components = 4

-- 4. Any invalid point values.
select
    a.company_name,
    sc.score_dimension,
    sc.component_key,
    sc.points_awarded,
    sc.max_points
from public.score_components sc
join public.accounts a
    on a.id = sc.account_id
where sc.rule_version = 'SC-V1.0.0'
  and (
      sc.points_awarded < 0
      or (
          sc.max_points > 0
          and sc.points_awarded > sc.max_points
      )
  );

-- Expected: zero rows.

-- 5. Duplicate logical score components.
select
    account_id,
    score_dimension,
    component_key,
    rule_version,
    count(*) as duplicate_count
from public.score_components
where rule_version = 'SC-V1.0.0'
group by
    account_id,
    score_dimension,
    component_key,
    rule_version
having count(*) > 1;

-- Expected: zero rows.

-- 6. Evidence linkage.
select
    a.company_name,
    count(*) filter (
        where sc.evidence_id is not null
    ) as evidence_linked_components,
    count(*) filter (
        where sc.evidence_id is null
    ) as aggregate_or_status_components
from public.score_components sc
join public.accounts a
    on a.id = sc.account_id
where sc.rule_version = 'SC-V1.0.0'
group by a.id, a.company_name
order by a.company_name;

-- Expected:
-- evidence_linked_components = 13
-- aggregate_or_status_components = 5
