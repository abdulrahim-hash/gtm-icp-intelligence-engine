-- 004_discovery_gate_v1.sql
-- Deterministic pre-research qualification gate.
-- Purpose: reduce obvious discovery noise before website research/enrichment.
-- Version: DG-V1.0.0

alter table public.accounts
    add column if not exists discovery_gate_status text,
    add column if not exists discovery_gate_reason text,
    add column if not exists discovery_gate_version text,
    add column if not exists discovery_gated_at timestamptz;

alter table public.accounts
    drop constraint if exists accounts_discovery_gate_status_check;

alter table public.accounts
    add constraint accounts_discovery_gate_status_check
    check (
        discovery_gate_status is null
        or discovery_gate_status in ('pass_to_research', 'review', 'reject')
    );

create index if not exists accounts_discovery_gate_status_idx
    on public.accounts(discovery_gate_status);

-- Backfill only currently ungated Apify Google Maps accounts.
-- This is a pre-research gate, not the final ICP decision.
with evaluated as (
    select
        id,
        case
            when permanently_closed is true
                then 'reject'

            when lower(coalesce(primary_category, '')) in (
                'dry cleaner',
                'house cleaning service',
                'carpet cleaning service',
                'building restoration service'
            )
                then 'reject'

            when lower(coalesce(primary_category, '')) = 'janitorial service'
                 and normalized_domain is not null
                 and normalized_domain not in (
                     'nextdoor.com',
                     'readdy.cc',
                     'facebook.com',
                     'instagram.com'
                 )
                then 'pass_to_research'

            else 'review'
        end as gate_status,

        case
            when permanently_closed is true
                then 'Google Maps indicates business is permanently closed.'

            when lower(coalesce(primary_category, '')) in (
                'dry cleaner',
                'house cleaning service',
                'carpet cleaning service',
                'building restoration service'
            )
                then 'Primary Google Maps category is an explicit out-of-scope service category.'

            when lower(coalesce(primary_category, '')) = 'janitorial service'
                 and normalized_domain is not null
                 and normalized_domain not in (
                     'nextdoor.com',
                     'readdy.cc',
                     'facebook.com',
                     'instagram.com'
                 )
                then 'Janitorial-service category plus a usable first-party domain; eligible for deeper website research.'

            when lower(coalesce(primary_category, '')) = 'janitorial service'
                 and normalized_domain is null
                then 'Janitorial-service category but no usable domain; manual/public-web review required.'

            when normalized_domain in (
                'nextdoor.com',
                'readdy.cc',
                'facebook.com',
                'instagram.com'
            )
                then 'Domain is a third-party/hosted profile rather than a reliable first-party company domain.'

            else
                'Discovery record is potentially relevant but category/domain evidence is insufficient for automatic research eligibility.'
        end as gate_reason
    from public.accounts
    where discovery_source = 'apify_google_maps'
      and discovery_gate_status is null
)
update public.accounts a
set
    discovery_gate_status = e.gate_status,
    discovery_gate_reason = e.gate_reason,
    discovery_gate_version = 'DG-V1.0.0',
    discovery_gated_at = now(),
    qualification_status = case
        when e.gate_status = 'pass_to_research' then 'hard_gate_pass'
        when e.gate_status = 'review' then 'hard_gate_review'
        when e.gate_status = 'reject' then 'rejected'
        else qualification_status
    end
from evaluated e
where a.id = e.id;

-- Verification result.
select
    discovery_gate_status,
    count(*) as account_count
from public.accounts
where discovery_source = 'apify_google_maps'
group by discovery_gate_status
order by discovery_gate_status;
