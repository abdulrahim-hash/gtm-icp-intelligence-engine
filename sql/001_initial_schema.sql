-- 001_initial_schema.sql
-- Commercial Cleaning GTM Intelligence Engine
-- Day 2: source-of-truth data foundation
-- Safe to run in a new Supabase project.
-- No secrets are stored in this file.

create extension if not exists pgcrypto;

-- ---------- ENUM-LIKE CHECK HELPERS VIA TEXT + CHECKS ----------
-- We intentionally use text + checks instead of Postgres enums so
-- values can evolve with less migration friction.

-- ---------- ACCOUNTS ----------
create table if not exists public.accounts (
    id uuid primary key default gen_random_uuid(),

    -- identity
    company_name text not null,
    normalized_company_name text,
    domain text,
    normalized_domain text,
    website_url text,
    linkedin_url text,
    google_maps_url text,

    -- geography
    country text default 'United States',
    state text,
    city text,
    street_address text,
    postal_code text,

    -- source/provider metadata
    discovery_source text not null default 'manual',
    discovery_source_id text,
    source_query text,
    source_payload jsonb default '{}'::jsonb,

    -- basic firmographics
    industry text,
    employee_band text,
    employee_count_estimate integer,
    founded_year integer,
    company_type text,

    -- GTM / operating characteristics
    operator_type text,
    commercial_relevance text,
    business_model text,
    franchise_status text,
    service_area_summary text,

    -- qualification state
    hard_gate_status text not null default 'unreviewed'
        check (hard_gate_status in ('unreviewed','pass','review','reject')),
    qualification_status text not null default 'discovered'
        check (qualification_status in (
            'discovered',
            'normalized',
            'hard_gate_pass',
            'hard_gate_review',
            'rejected',
            'research_pending',
            'researched',
            'scored',
            'contact_pending',
            'outbound_ready',
            'contacted',
            'responded',
            'meeting_booked',
            'proposal',
            'won',
            'lost'
        )),
    rejection_reason text,

    -- component scores (0-100)
    fit_score numeric(5,2),
    need_score numeric(5,2),
    signal_score numeric(5,2),
    confidence_score numeric(5,2),

    -- final prioritization
    priority_score numeric(5,2),
    account_tier text
        check (account_tier is null or account_tier in ('A','B','C','REJECT','REVIEW')),

    -- explainability
    qualification_summary text,
    score_version text,
    manual_label text
        check (manual_label is null or manual_label in ('A','B','C','REJECT','REVIEW')),
    manual_review_reason text,

    -- controls
    do_not_contact boolean not null default false,
    is_test_record boolean not null default false,

    -- timestamps
    discovered_at timestamptz not null default now(),
    last_researched_at timestamptz,
    last_scored_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint chk_score_ranges check (
        (fit_score is null or fit_score between 0 and 100)
        and (need_score is null or need_score between 0 and 100)
        and (signal_score is null or signal_score between 0 and 100)
        and (confidence_score is null or confidence_score between 0 and 100)
        and (priority_score is null or priority_score between 0 and 100)
    )
);

-- Normalize uniqueness around domain when available.
create unique index if not exists accounts_normalized_domain_unique
    on public.accounts (normalized_domain)
    where normalized_domain is not null and normalized_domain <> '';

create index if not exists accounts_status_idx
    on public.accounts (qualification_status);

create index if not exists accounts_tier_idx
    on public.accounts (account_tier);

create index if not exists accounts_state_city_idx
    on public.accounts (state, city);

-- ---------- ACCOUNT EVIDENCE ----------
-- Evidence is stored separately so scoring decisions can be audited.
create table if not exists public.account_evidence (
    id uuid primary key default gen_random_uuid(),
    account_id uuid not null references public.accounts(id) on delete cascade,

    evidence_type text not null,
    evidence_key text,
    evidence_value text,
    evidence_json jsonb default '{}'::jsonb,

    source_type text not null,
    source_url text,
    source_provider text,
    source_observed_at timestamptz not null default now(),

    confidence numeric(5,2)
        check (confidence is null or confidence between 0 and 100),

    is_positive boolean,
    is_current boolean not null default true,

    created_at timestamptz not null default now()
);

create index if not exists account_evidence_account_idx
    on public.account_evidence (account_id);

create index if not exists account_evidence_type_idx
    on public.account_evidence (evidence_type);

-- ---------- SCORE COMPONENTS ----------
-- Keep every score component inspectable instead of only storing totals.
create table if not exists public.score_components (
    id uuid primary key default gen_random_uuid(),
    account_id uuid not null references public.accounts(id) on delete cascade,

    score_dimension text not null
        check (score_dimension in ('fit','need','signal','confidence')),
    component_key text not null,
    component_label text,
    component_value numeric(8,2),
    max_points numeric(8,2),
    points_awarded numeric(8,2) not null default 0,

    evidence_id uuid references public.account_evidence(id) on delete set null,
    rule_version text not null,
    reasoning text,

    created_at timestamptz not null default now()
);

create index if not exists score_components_account_idx
    on public.score_components (account_id);

create index if not exists score_components_dimension_idx
    on public.score_components (score_dimension);

-- ---------- CONTACTS ----------
create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    account_id uuid not null references public.accounts(id) on delete cascade,

    first_name text,
    last_name text,
    full_name text,
    job_title text,
    seniority text,
    persona text,

    email text,
    email_status text,
    phone text,
    linkedin_url text,

    contact_source text,
    source_payload jsonb default '{}'::jsonb,

    is_primary_decision_maker boolean not null default false,
    do_not_contact boolean not null default false,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists contacts_account_idx
    on public.contacts (account_id);

create unique index if not exists contacts_email_unique
    on public.contacts (lower(email))
    where email is not null and email <> '';

-- ---------- OUTREACH EVENTS ----------
create table if not exists public.outreach_events (
    id uuid primary key default gen_random_uuid(),
    account_id uuid references public.accounts(id) on delete cascade,
    contact_id uuid references public.contacts(id) on delete set null,

    channel text not null
        check (channel in ('email','linkedin','call','sms','other')),
    event_type text not null,
    campaign_name text,
    message_variant text,

    external_event_id text,
    event_payload jsonb default '{}'::jsonb,

    occurred_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create index if not exists outreach_events_account_idx
    on public.outreach_events (account_id);

create index if not exists outreach_events_contact_idx
    on public.outreach_events (contact_id);

-- ---------- EXPERIMENTS ----------
create table if not exists public.experiments (
    id uuid primary key default gen_random_uuid(),
    experiment_code text unique not null,
    title text not null,
    hypothesis text,
    status text not null default 'planned'
        check (status in ('planned','running','complete','aborted')),
    started_at timestamptz,
    ended_at timestamptz,
    notes text,
    metrics jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- ---------- PROCESSING RUNS ----------
-- Basic observability for n8n / ingestion / research jobs.
create table if not exists public.processing_runs (
    id uuid primary key default gen_random_uuid(),
    run_type text not null,
    external_run_id text,
    status text not null default 'started'
        check (status in ('started','success','partial','failed')),
    records_received integer not null default 0,
    records_created integer not null default 0,
    records_updated integer not null default 0,
    records_rejected integer not null default 0,
    error_summary text,
    metadata jsonb default '{}'::jsonb,
    started_at timestamptz not null default now(),
    completed_at timestamptz
);

-- ---------- UPDATED_AT TRIGGER ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists accounts_set_updated_at on public.accounts;
create trigger accounts_set_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

-- ---------- INITIAL RLS ----------
-- Keep RLS enabled. The server-side n8n workflow should use a secret key
-- stored in n8n credentials/environment variables, never in GitHub.
alter table public.accounts enable row level security;
alter table public.account_evidence enable row level security;
alter table public.score_components enable row level security;
alter table public.contacts enable row level security;
alter table public.outreach_events enable row level security;
alter table public.experiments enable row level security;
alter table public.processing_runs enable row level security;

-- No public policies are created here intentionally.
-- Server-side service credentials can bypass RLS when appropriate.
