import { getTexasCity, TEXAS_CITIES } from "@/lib/texas-cities";
import {
  US_STATE_ABBR,
  US_STATE_CITY_ROWS,
  US_STATE_REGION,
} from "@/lib/us-locations-data";

export type UsLocationFaq = { q: string; a: string };

export type UsStatePage = {
  slug: string;
  name: string;
  abbr: string;
  region: string;
  headline: string;
  intro: string;
  bullets: string[];
  faqs: UsLocationFaq[];
  keywords: string[];
  cities: { name: string; slug: string; href: string }[];
};

export type UsCityPage = {
  stateSlug: string;
  stateName: string;
  stateAbbr: string;
  slug: string;
  name: string;
  region: string;
  headline: string;
  intro: string;
  localFocus: string[];
  processSteps: { title: string; body: string }[];
  note: string;
  faqs: UsLocationFaq[];
  keywords: string[];
  siblingCities: { name: string; href: string }[];
  /** True when this city is served from the existing /serving-texas tree */
  texasCanonical?: boolean;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\bst\b/g, "st")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Map CSV Texas city names → existing /serving-texas slugs when present */
const TEXAS_CSV_TO_SLUG: Record<string, string> = {
  houston: "houston",
  "san antonio": "san-antonio",
  dallas: "dallas",
  austin: "austin",
  "fort worth": "fort-worth",
  "el paso": "el-paso",
  arlington: "arlington",
};

export function stateSlug(name: string) {
  return slugify(name);
}

export function citySlug(name: string) {
  return slugify(name);
}

export function texasCityHref(cityName: string): string | null {
  const key = cityName.toLowerCase();
  const mapped = TEXAS_CSV_TO_SLUG[key];
  if (mapped && getTexasCity(mapped)) return `/serving-texas/${mapped}`;
  const byName = TEXAS_CITIES.find((c) => c.name.toLowerCase() === key);
  return byName ? `/serving-texas/${byName.slug}` : null;
}

export function usCityHref(stateName: string, cityName: string): string {
  if (stateName === "Texas") {
    const tx = texasCityHref(cityName);
    if (tx) return tx;
  }
  return `/serving-united-states/${stateSlug(stateName)}/${citySlug(cityName)}`;
}

function buildState(row: { state: string; cities: string[] }): UsStatePage {
  const name = row.state;
  const slug = stateSlug(name);
  const abbr = US_STATE_ABBR[name] ?? name.slice(0, 2).toUpperCase();
  const region = US_STATE_REGION[name] ?? "United States";
  const v = hash(slug) % 4;
  const cityList = row.cities.join(", ");

  const headlines = [
    `Online investment accounts for ${name} residents`,
    `${name} (${abbr}) — wealth, savings & fixed deposits online`,
    `Financial services for clients across ${name}`,
    `Open an investment account from ${name}, USA`,
  ];
  const intros = [
    `AWS Vision Financial works with ${name} clients remotely. You can open savings, fixed deposits, or wealth plans online, finish KYC from home, and track everything in the portal — whether you are in ${row.cities[0]} or elsewhere in ${name}.`,
    `${name} households use AWS Vision for portfolio tracking and published program rates without a local storefront. Coverage is nationwide; this page is for people searching from ${region} / ${abbr}. Major metros we list: ${cityList}.`,
    `Looking for an investment firm that serves ${name}? We are an online U.S. firm — phone and portal support, clear rates pages, no invented ${name} retail branch. Start from ${row.cities[0]}, ${row.cities[1] ?? row.cities[0]}, or any ZIP in the state.`,
    `Residents of ${name} enroll the same way as clients in other states: signup, remote identity checks, then fund the product that fits. ${region} clients call +1 (469) 754-2201 when they need a person.`,
  ];
  const bulletSets = [
    [
      `Serve ${name} online — same products as the rest of the U.S.`,
      `City pages for ${row.cities.slice(0, 3).join(", ")}${row.cities.length > 3 ? ", and more" : ""}`,
      "Honest about offices: Delaware registered office / Maryland HQ — not a fake local lobby",
    ],
    [
      `Remote KYC for ${abbr} applicants`,
      "Savings, FD / CD-style plans, and wealth tiers with portal statements",
      `Built for ${region} schedules — travel and hybrid work friendly`,
    ],
    [
      `Compare rates before you enroll from ${name}`,
      "Support by phone and email after you fund",
      `${row.cities[0]} and nearby metros linked below`,
    ],
    [
      `Statewide ${name} service area (digital)`,
      "No requirement to visit a branch to open or track accounts",
      "Guides and compare tools if you want to research first",
    ],
  ];

  return {
    slug,
    name,
    abbr,
    region,
    headline: headlines[v],
    intro: intros[v],
    bullets: bulletSets[v],
    faqs: [
      {
        q: `Can someone in ${name} open an AWS Vision account?`,
        a: `Yes. ${name} residents complete signup and KYC online, then fund savings, fixed deposit, or wealth plans from the client portal.`,
      },
      {
        q: `Do you have a public office in ${name}?`,
        a: `We do not operate a public retail branch network in ${name}. Clients are served online and by phone as part of our U.S. service-area model.`,
      },
    ],
    keywords: [
      `Investment Firm ${name}`,
      `Financial Advisor ${name}`,
      `Wealth Management ${name}`,
      `Online Investment Account ${abbr}`,
      `Financial Services ${name} USA`,
    ],
    cities: row.cities.map((cityName) => ({
      name: cityName,
      slug: citySlug(cityName),
      href: usCityHref(name, cityName),
    })),
  };
}

function buildCity(
  stateName: string,
  cityName: string,
  siblingNames: string[]
): UsCityPage {
  const stateSlugVal = stateSlug(stateName);
  const slug = citySlug(cityName);
  const abbr = US_STATE_ABBR[stateName] ?? "";
  const region = US_STATE_REGION[stateName] ?? "United States";
  const others = siblingNames.filter((c) => c !== cityName);
  const nearby = others.slice(0, 2).join(" and ") || stateName;
  const v = hash(`${stateSlugVal}:${slug}`) % 5;
  const texasHref = stateName === "Texas" ? texasCityHref(cityName) : null;

  const headlines = [
    `Investment accounts in ${cityName}, ${abbr}`,
    `${cityName}, ${stateName} — online wealth & savings`,
    `Open an account from ${cityName} (${abbr})`,
    `Financial services for ${cityName} residents`,
    `${cityName} investors — remote KYC, portal tracking`,
  ];
  const intros = [
    `If you live in ${cityName} or nearby ${nearby}, you can use AWS Vision online: savings, fixed deposits, and wealth plans with remote KYC. We cover ${stateName} as part of nationwide U.S. service — not a walk-in ${cityName} branch.`,
    `${cityName} clients enroll the same way as other ${abbr} residents. Review rates, apply at signup, verify identity digitally, then fund. Support: +1 (469) 754-2201.`,
    `Searching for a financial advisor or investment firm in ${cityName}? We are upfront: digital firm, portal statements, phone help. Handy if you split time between ${cityName} and ${others[0] ?? stateName}.`,
    `${region} households in ${cityName} often want clear program terms before wiring funds. Start with /rates and /compare, then open an account when it fits.`,
    `AWS Vision serves ${cityName}, ${stateName} remotely. No claim of a public ${cityName} storefront — just online onboarding and portfolio tools for U.S. clients.`,
  ];
  const focusSets = [
    [
      `${cityName} households comparing online vs local advisors`,
      `People near ${nearby} who want wealth plans without a lobby visit`,
      "Investors who check published rates before they fund",
    ],
    [
      `Remote workers and travelers based in ${cityName}`,
      `${stateName} clients who prefer phone + portal support`,
      "Savers looking at FD-style terms alongside flexible accounts",
    ],
    [
      `Families in ${cityName} starting longer-horizon plans`,
      `Professionals who already bank online and want the same for investing`,
      `Residents comparing options across ${nearby}`,
    ],
    [
      `${abbr} applicants who need KYC done without an appointment desk`,
      "Clients who want monthly statements in one login",
      "Households that will not tolerate fake Maps pins for offices we do not run",
    ],
    [
      `${cityName} searches for wealth management with honest delivery`,
      `Neighbors in ${nearby} using the same statewide / national model`,
      "People who read the guides before they apply",
    ],
  ];
  const notes = [
    `${cityName} sits in ${region}. One online account works whether you are home or on the road in ${stateName}.`,
    `We list ${cityName} so searchers get straight answers — products, process, and support — without inventing a local address.`,
    `Same stacking as other U.S. cities: signup → KYC → fund → track. ${cityName} is not a special exception.`,
    `If you outgrow this page, the ${stateName} hub and national guides go deeper on products.`,
    `Questions from ${cityName}? Email or call — humans answer; the portal holds the balances.`,
  ];

  return {
    stateSlug: stateSlugVal,
    stateName,
    stateAbbr: abbr,
    slug,
    name: cityName,
    region,
    headline: headlines[v],
    intro: intros[v],
    localFocus: focusSets[v],
    processSteps: [
      {
        title: `Apply from ${cityName}`,
        body: `Create your account online. ${stateName} ID works for KYC — you do not need to visit an office in ${cityName}.`,
      },
      {
        title: "Pick savings, FD, or wealth",
        body: "Skim current terms on the rates page, then choose what matches your timeline.",
      },
      {
        title: "Fund and follow in the portal",
        body: "After approval, add funds and watch balances and statements online. Call if something looks off.",
      },
    ],
    note: notes[v],
    faqs: [
      {
        q: `Does AWS Vision serve ${cityName}, ${stateName}?`,
        a: `Yes. ${cityName} residents can open accounts online under our U.S. service-area model, with portal access and phone support.`,
      },
      {
        q: `Is there a branch in ${cityName}?`,
        a: `No public retail branch in ${cityName}. Service is remote — portal, phone, and email.`,
      },
    ],
    keywords: [
      `Investment Firm ${cityName}`,
      `Financial Advisor ${cityName} ${abbr}`,
      `Wealth Management ${cityName}`,
      `Investment Account ${cityName} ${stateName}`,
      `Online Investing ${cityName} ${abbr}`,
    ],
    siblingCities: others.slice(0, 6).map((n) => ({
      name: n,
      href: usCityHref(stateName, n),
    })),
    texasCanonical: Boolean(texasHref),
  };
}

export const US_STATES: UsStatePage[] = US_STATE_CITY_ROWS.map(buildState);

export const US_CITIES: UsCityPage[] = US_STATE_CITY_ROWS.flatMap((row) =>
  row.cities.map((cityName) => buildCity(row.state, cityName, row.cities))
);

/** City pages we generate under /serving-united-states/... (skip Texas cities that already live under /serving-texas) */
export const US_CITIES_ROUTABLE: UsCityPage[] = US_CITIES.filter((c) => !c.texasCanonical);

export function getUsState(slug: string) {
  return US_STATES.find((s) => s.slug === slug) ?? null;
}

export function getUsCity(stateSlugVal: string, citySlugVal: string) {
  return (
    US_CITIES.find((c) => c.stateSlug === stateSlugVal && c.slug === citySlugVal) ?? null
  );
}

export function getUsCityRoutable(stateSlugVal: string, citySlugVal: string) {
  return (
    US_CITIES_ROUTABLE.find(
      (c) => c.stateSlug === stateSlugVal && c.slug === citySlugVal
    ) ?? null
  );
}
