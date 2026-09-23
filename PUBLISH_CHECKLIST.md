# Public GitHub Publish Checklist

1. Confirm every file in `workflows/` is the sanitized public version.
2. Add cropped/redacted screenshots from the final operational system.
3. Run `python scripts/prepublish_scan.py .`.
4. Review `git diff --cached` manually.
5. Confirm SMTP2GO live sending remains disabled operationally.
6. Confirm no `.env`, raw export ZIP, database dump, API key, or service-role credential is present.
7. Check screenshots for prospect emails, LinkedIn URLs, CRM IDs, credential IDs, project refs, and internal workflow IDs.
8. Add repository topics such as `gtm-engineering`, `n8n`, `supabase`, `hubspot`, `revops`, and `sales-automation`.
9. Record the Loom walkthrough and link it near the top of the README.
10. Publish only after the final manual security review.
