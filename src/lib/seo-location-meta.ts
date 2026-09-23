import type { TexasCity } from "@/lib/texas-cities";
import type { UsCityPage, UsStatePage } from "@/lib/us-locations";

/** Keep meta description in a strong SERP range */
export function clipMetaDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sliced = clean.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 100 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function texasCitySeo(city: TexasCity) {
  const name = city.name;
  const title = city.light
    ? `${name}, TX Investment Accounts & Wealth Management | AWS Vision`
    : `${name} Investment Firm & Wealth Management | AWS Vision Financial`;

  const description = clipMetaDescription(
    city.intro.length > 40
      ? city.intro
      : `Open an online investment account in ${name}, Texas with AWS Vision Financial — wealth management, savings, and fixed deposits. Remote KYC, portal tracking, no retail branch required.`
  );

  const keywords = Array.from(
    new Set([
      ...city.keywords,
      `Investment Firm ${name}`,
      `Investment Firm ${name} TX`,
      `Wealth Management ${name}`,
      `Wealth Management ${name} Texas`,
      `Financial Advisor ${name}`,
      `Financial Advisor ${name} TX`,
      `Investment Advisor ${name}`,
      `Investment Management ${name}`,
      `Portfolio Management ${name}`,
      `Online Investment Account ${name}`,
      `Financial Services ${name} Texas`,
      `AWS Vision ${name}`,
      "Investment Firm Texas",
      "Wealth Management Texas",
      "online investment firm USA",
    ])
  );

  return { title, description, keywords };
}

export function usStateSeo(state: UsStatePage) {
  const { name, abbr, region } = state;
  const title = `${name} (${abbr}) Investment Accounts & Wealth Management | AWS Vision`;
  const description = clipMetaDescription(
    `Serve ${name} clients online with AWS Vision Financial — savings, fixed deposits, and wealth management. Remote KYC for ${abbr} / ${region}. Major cities linked. No fake local storefront.`
  );
  const keywords = Array.from(
    new Set([
      ...state.keywords,
      `Investment Firm ${name}`,
      `Investment Company ${name}`,
      `Wealth Management ${name}`,
      `Financial Advisor ${name}`,
      `Financial Services ${name}`,
      `Investment Advisor ${abbr}`,
      `Online Investment Account ${name}`,
      `Open Investment Account ${name}`,
      `Wealth Management ${abbr}`,
      `AWS Vision ${name}`,
      "online investment firm USA",
      "nationwide financial services",
    ])
  );
  return { title, description, keywords };
}

export function usCitySeo(city: UsCityPage) {
  const { name, stateName, stateAbbr, region } = city;
  const title = `${name}, ${stateAbbr} Investment Firm & Wealth Management | AWS Vision`;
  const description = clipMetaDescription(
    `Online investment accounts for ${name}, ${stateName} (${stateAbbr}) — wealth management, savings, and fixed deposits with remote KYC. ${region} coverage via AWS Vision Financial. No local retail branch.`
  );
  const keywords = Array.from(
    new Set([
      ...city.keywords,
      `Investment Firm ${name}`,
      `Investment Firm ${name} ${stateAbbr}`,
      `Wealth Management ${name}`,
      `Wealth Management ${name} ${stateName}`,
      `Financial Advisor ${name}`,
      `Financial Advisor ${name} ${stateAbbr}`,
      `Investment Advisor ${name}`,
      `Investment Management ${name} ${stateAbbr}`,
      `Online Investment Account ${name}`,
      `Financial Services ${name} ${stateName}`,
      `AWS Vision ${name}`,
      `Investment Firm ${stateName}`,
      "online investment firm USA",
    ])
  );
  return { title, description, keywords };
}
