export type TexasCity = {
  slug: string;
  name: string;
  metro: string;
  headline: string;
  intro: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
};

export const TEXAS_CITIES: TexasCity[] = [
  {
    slug: "dallas",
    name: "Dallas",
    metro: "Dallas–Fort Worth",
    headline: "Online investment accounts for Dallas residents",
    intro:
      "AWS Vision Financial serves Dallas and DFW clients with remote account opening — savings, fixed deposits, and wealth management — without a branch visit. Call +1 (469) 754-2201 for support.",
    keywords: [
      "Dallas investment firm online",
      "Dallas wealth management",
      "open investment account Dallas TX",
      "Dallas fixed deposit account",
      "DFW online investing",
    ],
    faqs: [
      {
        q: "Can I open an AWS Vision account from Dallas?",
        a: "Yes. Dallas residents complete signup and KYC online, then fund savings, FD, or wealth accounts through the secure portal.",
      },
      {
        q: "Do you have a Dallas office?",
        a: "We are a service-based online firm. Dallas clients are served remotely by phone and portal — no retail storefront is required.",
      },
    ],
  },
  {
    slug: "houston",
    name: "Houston",
    metro: "Greater Houston",
    headline: "Investment accounts for Houston, Texas",
    intro:
      "Houston professionals and households can open AWS Vision savings, FD, and wealth accounts online with statewide Texas service coverage and U.S. licensing.",
    keywords: [
      "Houston investment account",
      "Houston wealth management online",
      "Houston fixed deposit rates",
      "open FD account Houston TX",
    ],
    faqs: [
      {
        q: "Is AWS Vision available in Houston?",
        a: "Yes. Houston clients enroll online and manage portfolios in the client portal with phone support.",
      },
      {
        q: "What products can Houston clients open?",
        a: "High-yield savings, fixed deposits / CDs, and wealth management investment plans.",
      },
    ],
  },
  {
    slug: "austin",
    name: "Austin",
    metro: "Austin metro",
    headline: "Online wealth & savings for Austin investors",
    intro:
      "Austin clients use AWS Vision for remote investing — transparent program rates, monthly profit distribution on wealth plans, and digital KYC.",
    keywords: [
      "Austin investment platform",
      "Austin wealth management online",
      "Austin high yield savings",
      "fintech investing Austin TX",
    ],
    faqs: [
      {
        q: "Can Austin startups and professionals invest with AWS Vision?",
        a: "Yes. Individual accounts open online. Compare rates and wealth tiers before you apply.",
      },
    ],
  },
  {
    slug: "san-antonio",
    name: "San Antonio",
    metro: "San Antonio metro",
    headline: "San Antonio online investment accounts",
    intro:
      "San Antonio residents can open savings and fixed deposit accounts or enroll in wealth plans with AWS Vision — fully online across Texas.",
    keywords: [
      "San Antonio investment account",
      "San Antonio fixed deposit",
      "online investing San Antonio TX",
    ],
    faqs: [
      {
        q: "How do San Antonio clients get support?",
        a: "Call +1 (469) 754-2201, email support@awsvision.com, or use the contact page to book an appointment.",
      },
    ],
  },
];

export function getTexasCity(slug: string) {
  return TEXAS_CITIES.find((c) => c.slug === slug) ?? null;
}
