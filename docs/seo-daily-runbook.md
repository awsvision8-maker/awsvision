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
   - **URL inspection:** request indexing for up to **5** not-yet-indexed priority URLs (stop on quota).
   - Priority order: hubs → Fort Worth/Dallas → new guides → homepage/Texas.
   - Log results briefly in chat.

3. **On-site micro-improvement** (one small change max unless broken)
   - Prefer: 1 missing internal link, title/meta tighten for a page with weak CTR intent, or refresh 1 FAQ sentence.
   - Never duplicate thin city spam. Never claim RIA / fake office / fake “#1”.
   - If code changed: commit + push + `npx vercel --prod --yes`.

4. **Outreach (real only)**
   - Do **not** send email unless Gmail/Chrome session clearly allows composing to a real target the user already approved.
   - Default daily: append **1 personalized draft** to `docs/seo-outreach-log.md` (status: `draft`) using templates in `docs/backlink-outreach.md`.
   - Rotate targets: Texas chamber / fintech podcast / CPA partner / directory.
   - Never PBN, link farms, fake reviews.

5. **Report**
   - Short chat update: health ✅/❌ · GSC actions · any deploy · outreach draft added · next focus.

## Weekly extras (Mon / Wed / Fri)

- **Mon:** deeper GSC Performance notes (top queries).
- **Wed:** spot-check 2 city pages + 1 guide in browser (title/H1/links).
- **Fri:** mark one outreach draft as `ready-to-send` for the user and remind them once.

## Stop conditions

- If user says stop daily SEO: kill loop PID, do not re-arm.
- If Chrome remote debugging blocked: skip GSC, still do health + outreach drafts + on-site.
