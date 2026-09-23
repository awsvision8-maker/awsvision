# GSC URL indexing queue

**Property:** https://awsvision.com  
**Rule:** Google Search Console allows only a small number of **Request indexing** actions per day (~10–20). When quota is exceeded, stop and resume the next calendar day.

## Last session (2026-09-23)

- Sitemap submitted: `/sitemap.xml` → **Success**
- Inspected many URLs; majority already **URL is on Google**
- **Request indexing quota exceeded** — stop further requests today

## Pending (not on Google at last check — request next day)

Priority order for next day:

1. https://awsvision.com/serving-texas/mckinney
2. https://awsvision.com/serving-texas/arlington
3. https://awsvision.com/investment-management
4. https://awsvision.com/guides/best-wealth-management-firm-texas
5. https://awsvision.com/guides/asset-management-texas
6. https://awsvision.com/guides/aws-vision-vs-us-banks
7. https://awsvision.com/guides/aws-vision-vs-fidelity
8. https://awsvision.com/guides/aws-vision-vs-schwab
9. https://awsvision.com/guides/how-to-choose-financial-advisor-texas
10. https://awsvision.com/guides/investment-advisor-vs-financial-advisor
11. https://awsvision.com/guides/financial-planning-for-business-owners

### New commercial guides (shipped 2026-09-23 — index after quota resets)

12. https://awsvision.com/guides/investment-company-texas
13. https://awsvision.com/guides/online-financial-advisor-texas
14. https://awsvision.com/guides/wealth-management-houston
15. https://awsvision.com/guides/investment-firm-fort-worth
16. https://awsvision.com/guides/wealth-management-san-antonio
17. https://awsvision.com/guides/wealth-advisor-dallas
18. https://awsvision.com/guides/best-portfolio-management-texas
19. https://awsvision.com/guides/financial-services-firm-texas

Then continue any remaining sitemap URLs that still show **URL is not on Google** / Discovered – not indexed.

## Next-day agent steps

1. Open GSC → URL Inspection (logged-in Chrome).
2. For each pending URL above: Inspect → **Request indexing** → confirm dialog → wait for “Indexing requested”.
3. Stop immediately on quota / “try again later”.
4. Update this file: move succeeded URLs to **Done**, leave the rest for the following day.
5. Do **not** spam Request indexing on pages already “URL is on Google”.

## Done

| Date | URL | Notes |
|------|-----|--------|
| 2026-09-23 | https://awsvision.com/serving-texas/frisco | Indexing requested earlier |
| 2026-09-23 | https://awsvision.com/serving-texas/austin | Indexing requested (already on Google; refresh) |
