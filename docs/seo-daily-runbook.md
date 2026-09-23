# Daily SEO run (agent)

**Property:** https://awsvision.com  
**When woken by `AGENT_LOOP_TICK_seo_daily`:** follow this runbook end-to-end. Do not ask the user. Do not invent backlinks or fake Texas addresses.

## Every day

1. **Live health**
   - Fetch `https://awsvision.com/sitemap.xml` — confirm it includes hubs + city pages + guides.
   - HTTP 200 check (batch): `/`, `/serving-texas`, `/investment-management`, `/investment-advisory`, `/wealth-management`, `/portfolio-management`, `/financial-planning`, `/serving-texas/dallas`, `/serving-texas/houston`, `/serving-texas/austin`, `/serving-texas/fort-worth`, `/serving-texas/san-antonio`, `/guides`.
   - If any 404/5xx: fix in repo, commit only if user previously allowed auto-commit for SEO (default: commit + push SEO fixes to `main` when clearly broken live pages), redeploy.

2. **Search Console** (user’s logged-in Chrome via browser-use)
   - Open GSC for `https://awsvision.com/`.
   - **Pages / indexing:** note new errors.
   - **URL inspection:** follow `docs/seo-indexing-queue.md` — request indexing for pending URLs only (skip already “URL is on Google”). Stop on quota.
   - Cap: respect daily Request indexing quota; never burn quota re-requesting indexed URLs.
   - Log results in `docs/seo-indexing-queue.md`.

3. **On-site micro-improvement** (one small change max unless broken)
   - Prefer: 1 missing internal link, title/meta tighten for a page with weak CTR intent, or refresh 1 FAQ sentence.
   - Never duplicate thin city spam. Never claim RIA / fake office / fake “#1”.
   - If code changed: commit + push + `npx vercel --prod --yes`.

4. **Outreach (real only) — Gmail authorized**
   - **Allowed account:** `abdulwahibshera@gmail.com` via logged-in Chrome (`mail.google.com`). Compose is permitted.
   - Daily: send **up to 1** personalized outreach email from that Gmail when a real public contact email exists for the target (chamber, podcast, directory “contact”, partner site).
   - Use templates in `docs/backlink-outreach.md`. Include awsvision.com links only (Texas / guides / hubs). No fake address. No PBN / fake reviews.
   - After send: update `docs/seo-outreach-log.md` → status `sent` + date. If no real recipient email found that day: keep/add `draft` only.
   - Never invent recipient addresses. Never email random people scraped without a public contact page.
   - Cap: max 1 send/day (deliverability + spam safety).

5. **Report**
   - Short chat update: health ✅/❌ · GSC actions · any deploy · outreach draft added · next focus.

## Weekly extras (Mon / Wed / Fri)

- **Mon:** deeper GSC Performance notes (top queries).
- **Wed:** spot-check 2 city pages + 1 guide in browser (title/H1/links).
- **Fri:** mark one outreach draft as `ready-to-send` for the user and remind them once.

## Stop conditions

- If user says stop daily SEO: kill loop PID, do not re-arm.
- If Chrome remote debugging blocked: skip GSC, still do health + outreach drafts + on-site.
