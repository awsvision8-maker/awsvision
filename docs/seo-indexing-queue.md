# GSC URL indexing queue

**Property:** https://awsvision.com  
**Rule:** Google Search Console allows only a small number of **Request indexing** actions per day (~10–20). When quota is exceeded, stop and resume the next calendar day.

## Last session (2026-09-24)

- Attempted pending URL inspection / Request indexing batch
- Confirmed: **https://awsvision.com/serving-texas/mckinney** → already **URL is on Google** (skip)
- GSC Overview showed ~**33 indexed** / ~**50 not indexed** at session start
- **Request indexing quota exceeded** — **stop all further requests today**
- Resume next calendar day from Pending list below

## Pending city pages (light Texas expansion — 2026-09-24)

Many new `/serving-texas/{city}` URLs shipped for major Texas cities (≈90 light pages + featured).  
**Do not burn quota requesting all in one day.** Batch ~10–15/day, skip if already on Google.

Priority first wave after current pending list:

- https://awsvision.com/serving-texas/irving
- https://awsvision.com/serving-texas/corpus-christi
- https://awsvision.com/serving-texas/laredo
- https://awsvision.com/serving-texas/lubbock
- https://awsvision.com/serving-texas/amarillo
- https://awsvision.com/serving-texas/garland
- https://awsvision.com/serving-texas/grand-prairie
- https://awsvision.com/serving-texas/mcallen
- https://awsvision.com/serving-texas/waco
- https://awsvision.com/serving-texas/killeen
- https://awsvision.com/serving-texas/round-rock
- https://awsvision.com/serving-texas/sugar-land
- https://awsvision.com/serving-texas/the-woodlands
- https://awsvision.com/serving-texas/midland
- https://awsvision.com/serving-texas/odessa

Then continue remaining cities from `/serving-texas` sitemap (hub lists all).

## Pending (request next day — skip if already “URL is on Google”)

Priority order:

1. https://awsvision.com/serving-texas/arlington
2. https://awsvision.com/investment-management
3. https://awsvision.com/guides/best-wealth-management-firm-texas
4. https://awsvision.com/guides/asset-management-texas
5. https://awsvision.com/guides/aws-vision-vs-us-banks
6. https://awsvision.com/guides/aws-vision-vs-fidelity
7. https://awsvision.com/guides/aws-vision-vs-schwab
8. https://awsvision.com/guides/how-to-choose-financial-advisor-texas
9. https://awsvision.com/guides/investment-advisor-vs-financial-advisor
10. https://awsvision.com/guides/financial-planning-for-business-owners
11. https://awsvision.com/guides/investment-company-texas
12. https://awsvision.com/guides/online-financial-advisor-texas
13. https://awsvision.com/guides/wealth-management-houston
14. https://awsvision.com/guides/investment-firm-fort-worth
15. https://awsvision.com/guides/wealth-management-san-antonio
16. https://awsvision.com/guides/wealth-advisor-dallas
17. https://awsvision.com/guides/best-portfolio-management-texas
18. https://awsvision.com/guides/financial-services-firm-texas

Then continue any remaining sitemap URLs that still show **URL is not on Google** / Discovered – not indexed.

## Next-day agent steps

1. Open GSC → URL Inspection (logged-in Chrome).
2. For each pending URL above: Inspect → if **URL is on Google**, skip; else **Request indexing** → confirm → wait for “Indexing requested”.
3. Stop immediately on quota / “try again later”.
4. Update this file: move succeeded URLs to **Done**, leave the rest for the following day.
5. Do **not** spam Request indexing on pages already “URL is on Google”.

## Done

| Date | URL | Notes |
|------|-----|--------|
| 2026-09-23 | https://awsvision.com/serving-texas/frisco | Indexing requested earlier |
| 2026-09-23 | https://awsvision.com/serving-texas/austin | Indexing requested (already on Google; refresh) |
| 2026-09-24 | https://awsvision.com/serving-texas/mckinney | Already on Google — no request needed |
