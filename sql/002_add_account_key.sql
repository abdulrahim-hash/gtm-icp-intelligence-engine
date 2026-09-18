-- 002_add_account_key.sql
-- Adds a provider-independent unique identity key used for safe upserts.

alter table public.accounts
add column if not exists account_key text;

-- Backfill any existing rows.
-- Priority:
-- 1) normalized domain
-- 2) source provider + source id
-- 3) normalized company + city + state
update public.accounts
set account_key =
    case
        when normalized_domain is not null and btrim(normalized_domain) <> ''
            then 'domain:' || lower(btrim(normalized_domain))
        when discovery_source_id is not null and btrim(discovery_source_id) <> ''
            then 'source:' || lower(btrim(discovery_source)) || ':' || lower(btrim(discovery_source_id))
        else
            'fallback:' ||
            lower(regexp_replace(btrim(company_name), '[^a-zA-Z0-9]+', '-', 'g')) ||
            ':' || lower(coalesce(btrim(city), 'unknown-city')) ||
            ':' || lower(coalesce(btrim(state), 'unknown-state'))
    end
where account_key is null or btrim(account_key) = '';

alter table public.accounts
alter column account_key set not null;

create unique index if not exists accounts_account_key_unique
on public.accounts (account_key);

create index if not exists accounts_discovery_source_idx
on public.accounts (discovery_source);

comment on column public.accounts.account_key is
'Stable provider-independent account identity used for idempotent ingestion/upsert.';
