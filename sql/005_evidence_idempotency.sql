-- 005_evidence_idempotency.sql
-- Makes Website Intelligence evidence rerunnable without duplicating evidence rows.

alter table public.account_evidence
    add column if not exists research_version text,
    add column if not exists evidence_fingerprint text;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conrelid = 'public.account_evidence'::regclass
          and conname = 'account_evidence_evidence_fingerprint_key'
    ) then
        alter table public.account_evidence
            add constraint account_evidence_evidence_fingerprint_key
            unique (evidence_fingerprint);
    end if;
end $$;

create index if not exists account_evidence_account_key_idx
    on public.account_evidence(account_id, evidence_key);

create index if not exists account_evidence_research_version_idx
    on public.account_evidence(research_version);

comment on column public.account_evidence.research_version is
'Version of the research/extraction contract that created this evidence row.';

comment on column public.account_evidence.evidence_fingerprint is
'Stable idempotency key. Current Website Intelligence contract uses account_id|research_version|evidence_key.';
