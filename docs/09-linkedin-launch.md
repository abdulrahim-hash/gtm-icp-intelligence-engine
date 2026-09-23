# LinkedIn Launch Draft

I’ve been building a GTM system as if it were infrastructure, not just an automation.

The result is my first flagship GTM Engineering project:

**GTM ICP Intelligence Engine**

Discovery → Website Intelligence → Scoring → Contact Acquisition → Identity Resolution → Verified Enrichment → HubSpot → Controlled Outreach → Lifecycle → QA

I cared less about adding tools and more about making the system answer:

Why did this account qualify?
Why was this contact selected?
Did this provider call already happen?
Will a rerun duplicate the CRM record?
Should this person still be contacted right now?
What happens if an unsubscribe arrives before the next step?

Pilot state:

**39 scored accounts**
**5 fully measured accounts**
**7 canonical decision-makers**
**7 verified emails**
**7 HubSpot mappings**
**7 planned outreach tasks**
**0 accidental sends**

The most valuable part was handling provider limitations, rate limits, retry state, partial CRM execution, identity logic and credential architecture.

I’ll share the architecture and build decisions next.
