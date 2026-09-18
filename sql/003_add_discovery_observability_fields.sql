-- 003_add_discovery_observability_fields.sql
-- Adds account-level Google Maps discovery fields and accurate processed-count observability.

alter table public.accounts
    add column if not exists company_phone text,
    add column if not exists primary_category text,
    add column if not exists google_rating numeric(3,2),
    add column if not exists google_review_count integer,
    add column if not exists permanently_closed boolean,
    add column if not exists temporarily_closed boolean,
    add column if not exists latitude numeric(10,7),
    add column if not exists longitude numeric(10,7);

alter table public.accounts
    drop constraint if exists chk_google_rating;

alter table public.accounts
    add constraint chk_google_rating
    check (google_rating is null or google_rating between 0 and 5);

alter table public.accounts
    drop constraint if exists chk_google_review_count;

alter table public.accounts
    add constraint chk_google_review_count
    check (google_review_count is null or google_review_count >= 0);

alter table public.processing_runs
    add column if not exists records_processed integer not null default 0;

comment on column public.processing_runs.records_processed is
'Number of records successfully normalized/persisted during the run. Created-vs-updated counts remain separate and should only be populated when measured accurately.';
