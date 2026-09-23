# Security & Publishing Rules

Do not commit API keys, tokens, service-role secrets, raw n8n credentials, real prospect emails/phones, private LinkedIn URLs, provider contact IDs, Supabase project refs, HubSpot portal/contact IDs, or unredacted operational screenshots.

The workflow JSON files in `workflows/` are sanitized references and are not deployment-ready.

Before a public push:

```bash
python scripts/prepublish_scan.py .
```

Then inspect the staged diff manually.
