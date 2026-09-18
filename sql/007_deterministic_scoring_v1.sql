-- 007_deterministic_scoring_v1.sql
-- Deterministic, idempotent scoring infrastructure.
-- Rule version: SC-V1.0.0

-- Idempotency:
-- one row per account + dimension + component + rule version.
create unique index if not exists score_components_rule_component_uq
on public.score_components (
    account_id,
    score_dimension,
    component_key,
    rule_version
);

create index if not exists score_components_rule_version_idx
on public.score_components (rule_version);

create index if not exists score_components_account_dimension_idx
on public.score_components (account_id, score_dimension);

-- Human-readable score summary for Scoring V1.
-- Signal remains NULL while it is explicitly unmeasured.
create or replace view public.account_score_summary_v1 as
select
    a.id as account_id,
    a.company_name,
    a.normalized_domain,

    round(
        sum(sc.points_awarded) filter (
            where sc.score_dimension = 'fit'
              and sc.rule_version = 'SC-V1.0.0'
        ),
        2
    ) as fit_score,

    round(
        sum(sc.points_awarded) filter (
            where sc.score_dimension = 'need'
              and sc.rule_version = 'SC-V1.0.0'
        ),
        2
    ) as need_score,

    case
        when coalesce(
            sum(sc.max_points) filter (
                where sc.score_dimension = 'signal'
                  and sc.rule_version = 'SC-V1.0.0'
            ),
            0
        ) = 0
        then null
        else round(
            sum(sc.points_awarded) filter (
                where sc.score_dimension = 'signal'
                  and sc.rule_version = 'SC-V1.0.0'
            ),
            2
        )
    end as signal_score,

    case
        when coalesce(
            sum(sc.max_points) filter (
                where sc.score_dimension = 'signal'
                  and sc.rule_version = 'SC-V1.0.0'
            ),
            0
        ) = 0
        then 'unmeasured'
        else 'measured'
    end as signal_status,

    round(
        sum(sc.points_awarded) filter (
            where sc.score_dimension = 'confidence'
              and sc.rule_version = 'SC-V1.0.0'
        ),
        2
    ) as confidence_score,

    count(*) filter (
        where sc.rule_version = 'SC-V1.0.0'
    ) as component_rows,

    max(sc.created_at) filter (
        where sc.rule_version = 'SC-V1.0.0'
    ) as scored_at

from public.accounts a
left join public.score_components sc
    on sc.account_id = a.id
group by
    a.id,
    a.company_name,
    a.normalized_domain;
