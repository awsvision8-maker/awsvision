import { getLightTexasCities } from "@/lib/texas-cities-light";

export type TexasCity = {
  slug: string;
  name: string;
  metro: string;
  headline: string;
  intro: string;
  localFocus: string[];
  processSteps?: { title: string; body: string }[];
  whyLocal?: string[];
  keywords: string[];
  faqs: { q: string; a: string }[];
  /** Compact pages for broader city coverage / indexing */
  light?: boolean;
};

export const TEXAS_CITIES_FEATURED: TexasCity[] = [
  {
    slug: "dallas",
    name: "Dallas",
    metro: "Dallas–Fort Worth (DFW)",
    headline: "Investment firm & wealth management for Dallas, TX",
    intro:
      "AWS Vision Financial serves Dallas and DFW clients as an online investment firm — investment management, portfolio tracking, savings, and fixed deposits — with remote KYC and phone support. No Dallas retail branch required.",
    localFocus: [
      "Dallas professionals and households seeking online investment management",
      "DFW clients who want wealth management without a branch visit",
      "Investors comparing financial services and portfolio options in North Texas",
    ],
    processSteps: [
      {
        title: "Apply online from Dallas",
        body: "Create your account at awsvision.com/signup. Dallas and DFW residents complete identity verification (KYC) remotely — no in-person appointment required.",
      },
      {
        title: "Choose savings, FD, or wealth",
        body: "Pick flexible savings, a fixed deposit with a defined term, or a wealth management tier with monthly program rates and portal statements.",
      },
      {
        title: "Fund and track in the portal",
        body: "After approval, fund your account and monitor balances 24/7. Support is available by phone at +1 (469) 754-2201 for North Texas clients.",
      },
    ],
    whyLocal: [
      "Dallas searches for “investment firm Dallas” and “financial advisor Dallas” often assume a storefront. We compete honestly as an online firm with statewide Texas service — clearer than inventing a fake address for Maps.",
      "DFW professionals who travel or work hybrid schedules often prefer remote onboarding and digital statements over branch visits.",
      "Compare published rates before you enroll, then review agreements in the portal — the same process whether you are in Dallas, Plano, Irving, or Fort Worth.",
    ],
    keywords: [
      "Investment Firm Dallas",
      "Investment Company Dallas TX",
      "Investment Advisor Dallas",
      "Investment Advisor Dallas TX",
      "Investment Management Dallas",
      "Investment Management Firm Dallas",
      "Financial Advisor Dallas",
      "Financial Advisor Dallas TX",
      "Financial Planning Dallas",
      "Wealth Management Dallas",
      "Wealth Management Firm Dallas",
      "Private Wealth Management Dallas",
      "Asset Management Dallas",
      "Portfolio Management Dallas",
      "Financial Services Dallas",
      "Investment Advisor DFW",
      "Financial Advisor DFW",
      "Wealth Management DFW",
    ],
    faqs: [
      {
        q: "Is AWS Vision an investment firm serving Dallas?",
        a: "Yes. Dallas and DFW clients open accounts online for savings, fixed deposits, and wealth / investment management plans, then track portfolios in the client portal.",
      },
      {
        q: "Do you have a physical Dallas office?",
        a: "We are a service-based online firm. Dallas clients are served remotely by phone and portal — we do not claim a public Dallas retail storefront.",
      },
      {
        q: "Can I get wealth management from Dallas without visiting a branch?",
        a: "Yes. Complete online signup and KYC, choose a wealth tier, fund your account, and review statements in the portal.",
      },
      {
        q: "How is this different from a local Dallas financial advisor?",
        a: "Local advisors may offer in-person meetings. AWS Vision focuses on online investment products, transparent rates, and remote support — a fit when you want digital onboarding across DFW.",
      },
    ],
  },
  {
    slug: "houston",
    name: "Houston",
    metro: "Greater Houston",
    headline: "Investment firm & financial services for Houston, TX",
    intro:
      "Houston residents use AWS Vision for online investment management, wealth plans, savings, and fixed deposits — licensed U.S. financial services with statewide Texas coverage and remote onboarding.",
    localFocus: [
      "Houston households comparing investment companies online",
      "Professionals seeking portfolio management without a local branch",
      "Clients who want transparent rates and monthly profit distribution on wealth plans",
    ],
    processSteps: [
      {
        title: "Enroll from Greater Houston",
        body: "Complete signup and KYC online from Houston or surrounding areas — Bellaire, Sugar Land, The Woodlands, and beyond.",
      },
      {
        title: "Pick your product mix",
        body: "Savings for flexibility, fixed deposits for defined terms, or wealth plans for longer-horizon portfolio growth.",
      },
      {
        title: "Manage everything in one portal",
        body: "Statements, balances, and support are available remotely — call or email when you need help.",
      },
    ],
    whyLocal: [
      "Houston is a major financial and energy market. Many residents search for a local advisor but still prefer online onboarding that works with busy schedules.",
      "We serve Houston as part of statewide Texas coverage — honest about being online, not a fake downtown storefront.",
    ],
    keywords: [
      "Investment Firm Houston",
      "Investment Firm Houston TX",
      "Investment Company Houston",
      "Investment Advisor Houston",
      "Investment Advisor Houston TX",
      "Investment Management Houston",
      "Investment Management Firm Houston",
      "Financial Advisor Houston",
      "Financial Advisor Houston TX",
      "Financial Planning Houston",
      "Wealth Management Houston",
      "Wealth Management Firm Houston",
      "Private Wealth Management Houston",
      "Asset Management Houston",
      "Portfolio Management Houston",
      "Financial Services Houston",
    ],
    faqs: [
      {
        q: "Does AWS Vision serve Houston as an investment company?",
        a: "Yes. Houston clients enroll online for savings, FD, and wealth management with portal access and phone support.",
      },
      {
        q: "Is there a Houston office?",
        a: "No public retail branch. Houston clients are served online across Texas — the same service-based model statewide.",
      },
    ],
  },
  {
    slug: "austin",
    name: "Austin",
    metro: "Austin metro",
    headline: "Investment management & wealth plans for Austin, TX",
    intro:
      "Austin investors open AWS Vision accounts online for investment management, portfolio tracking, savings, and fixed deposits — built for remote Texas clients who want clear program rates.",
    localFocus: [
      "Austin tech and professional households starting long-term investing",
      "Clients comparing wealth management firms online",
      "Investors who prefer digital KYC over a retail branch visit",
    ],
    processSteps: [
      {
        title: "Apply from Austin metro",
        body: "Signup and KYC online from Austin, Round Rock, Cedar Park, or anywhere in the metro — no downtown branch visit.",
      },
      {
        title: "Select savings, FD, or wealth",
        body: "Match products to your horizon; review published rates before you fund.",
      },
      {
        title: "Track in the portal",
        body: "Monitor balances and statements digitally with phone support when needed.",
      },
    ],
    whyLocal: [
      "Austin’s workforce often prefers fintech-style onboarding. We serve that preference without inventing a fake Congress Ave storefront.",
    ],
    keywords: [
      "Investment Firm Austin",
      "Investment Firm Austin TX",
      "Investment Company Austin",
      "Investment Advisor Austin",
      "Investment Advisor Austin TX",
      "Investment Management Austin",
      "Financial Advisor Austin",
      "Financial Advisor Austin TX",
      "Financial Planning Austin",
      "Wealth Management Austin",
      "Wealth Management Firm Austin",
      "Private Wealth Management Austin",
      "Asset Management Austin",
      "Portfolio Management Austin",
      "Financial Services Austin",
    ],
    faqs: [
      {
        q: "Can Austin residents open an investment account with AWS Vision?",
        a: "Yes. Signup and KYC are fully online. After approval, fund savings, FD, or wealth plans from the portal.",
      },
    ],
  },
  {
    slug: "fort-worth",
    name: "Fort Worth",
    metro: "Dallas–Fort Worth (DFW)",
    headline: "Investment firm & wealth management for Fort Worth, TX",
    intro:
      "Fort Worth and Tarrant County clients use AWS Vision as an online investment firm — wealth management, portfolio tracking, savings, and fixed deposits — with remote service across DFW.",
    localFocus: [
      "Fort Worth households seeking online investment management",
      "DFW west-side clients who want wealth plans without a Fort Worth storefront",
      "Investors comparing financial services across North Texas",
    ],
    processSteps: [
      {
        title: "Enroll across Tarrant County",
        body: "Fort Worth, Arlington, and nearby cities complete KYC online under the same DFW service model.",
      },
      {
        title: "Choose your accounts",
        body: "Savings, fixed deposits, or wealth tiers — compare on the rates page first.",
      },
      {
        title: "Stay connected",
        body: "Portal tracking plus phone support for North Texas clients.",
      },
    ],
    whyLocal: [
      "Fort Worth searches often overlap Dallas/DFW. We cover both sides of the metro honestly as one online Texas service area.",
    ],
    keywords: [
      "Investment Firm Fort Worth",
      "Investment Company Fort Worth",
      "Investment Advisor Fort Worth",
      "Investment Management Fort Worth",
      "Financial Advisor Fort Worth",
      "Financial Planning Fort Worth",
      "Wealth Management Fort Worth",
      "Wealth Management Firm Fort Worth",
      "Asset Management Fort Worth",
      "Portfolio Management Fort Worth",
      "Financial Services Fort Worth",
      "Private Wealth Management Fort Worth",
    ],
    faqs: [
      {
        q: "Do you serve Fort Worth?",
        a: "Yes. Fort Worth clients open accounts online and manage portfolios remotely, same as Dallas and the rest of DFW.",
      },
      {
        q: "Is there a Fort Worth office location?",
        a: "We do not operate a public Fort Worth retail branch. Service is online and by phone — accurate for a digital financial services firm.",
      },
    ],
  },
  {
    slug: "san-antonio",
    name: "San Antonio",
    metro: "San Antonio metro",
    headline: "Investment firm & financial services for San Antonio, TX",
    intro:
      "San Antonio residents can open AWS Vision savings, fixed deposit, and wealth management accounts online — investment and portfolio services with Texas-wide remote support.",
    localFocus: [
      "San Antonio households comparing local vs online investment firms",
      "Clients seeking wealth management and portfolio tracking online",
      "Investors who want clear rates before opening an account",
    ],
    processSteps: [
      {
        title: "Open from San Antonio metro",
        body: "Complete online KYC from San Antonio or nearby communities — no retail branch required.",
      },
      {
        title: "Fund the right product",
        body: "Savings, FD, or wealth plans based on your timeline; review rates first.",
      },
      {
        title: "Use the portal",
        body: "Track activity anytime; contact support by phone or email.",
      },
    ],
    whyLocal: [
      "San Antonio investors comparing “local firm” vs online options should prioritize honesty about offices and clear product pages — that is how we operate statewide.",
    ],
    keywords: [
      "Investment Firm San Antonio",
      "Investment Company San Antonio",
      "Investment Advisor San Antonio",
      "Investment Management San Antonio",
      "Financial Advisor San Antonio",
      "Financial Planning San Antonio",
      "Wealth Management San Antonio",
      "Wealth Management Firm San Antonio",
      "Asset Management San Antonio",
      "Portfolio Management San Antonio",
      "Private Wealth Management San Antonio",
    ],
    faqs: [
      {
        q: "Can San Antonio clients invest with AWS Vision?",
        a: "Yes. Enroll online, complete KYC, and fund savings, FD, or wealth plans. Support is available by phone and email.",
      },
    ],
  },
  {
    slug: "plano",
    name: "Plano",
    metro: "Dallas–Fort Worth (DFW)",
    headline: "Investment firm & wealth management for Plano, TX",
    intro:
      "Plano and Collin County residents use AWS Vision Financial online — investment management, wealth plans, savings, and fixed deposits with remote KYC across DFW.",
    localFocus: [
      "Plano professionals seeking online wealth and portfolio tracking",
      "North Dallas suburbs comparing investment firms without a branch visit",
      "Households that want clear rates before funding an account",
    ],
    processSteps: [
      {
        title: "Apply from Plano / Collin County",
        body: "Complete signup and KYC online from Plano, Frisco, McKinney, or nearby communities.",
      },
      {
        title: "Choose products",
        body: "Savings, FD, or wealth tiers — review the rates page first.",
      },
      {
        title: "Track in the portal",
        body: "Monitor balances and statements remotely with phone support.",
      },
    ],
    whyLocal: [
      "Plano searches often overlap Dallas/DFW. We cover the north metro honestly as part of statewide online Texas service.",
    ],
    keywords: [
      "Investment Firm Plano",
      "Investment Advisor Plano TX",
      "Financial Advisor Plano",
      "Wealth Management Plano",
      "Investment Management Plano",
      "Financial Services Plano TX",
    ],
    faqs: [
      {
        q: "Do you serve Plano, Texas?",
        a: "Yes. Plano clients open accounts online under the same DFW / Texas remote service model as Dallas.",
      },
    ],
  },
  {
    slug: "el-paso",
    name: "El Paso",
    metro: "El Paso metro",
    headline: "Investment accounts & wealth plans for El Paso, TX",
    intro:
      "El Paso residents can open AWS Vision savings, fixed deposit, and wealth management accounts online — statewide Texas coverage with remote support.",
    localFocus: [
      "El Paso households comparing online investment firms",
      "Clients who want portfolio tracking without traveling to a branch",
      "Investors seeking transparent rates before they enroll",
    ],
    processSteps: [
      {
        title: "Enroll from West Texas",
        body: "Signup and KYC are fully online for El Paso and surrounding areas.",
      },
      {
        title: "Fund your account",
        body: "Choose savings, FD, or wealth plans after reviewing current terms.",
      },
      {
        title: "Stay connected",
        body: "Use the portal for statements; call or email support anytime.",
      },
    ],
    whyLocal: [
      "West Texas clients deserve the same remote access as major metros — we serve El Paso as part of statewide Texas coverage, without claiming a local storefront we do not operate.",
    ],
    keywords: [
      "Investment Firm El Paso",
      "Financial Advisor El Paso",
      "Wealth Management El Paso",
      "Investment Advisor El Paso TX",
      "Financial Services El Paso",
    ],
    faqs: [
      {
        q: "Can El Paso residents open an AWS Vision account?",
        a: "Yes. Complete online KYC, then fund savings, FD, or wealth plans through the portal.",
      },
    ],
  },
  {
    slug: "frisco",
    name: "Frisco",
    metro: "Dallas–Fort Worth (DFW) · Collin / Denton County",
    headline: "Investment firm & wealth management for Frisco, TX",
    intro:
      "AWS Vision Financial serves Frisco and North DFW clients online — investment management, wealth plans, savings, and fixed deposits with remote KYC. No Frisco retail branch required.",
    localFocus: [
      "Frisco professionals and families comparing online investment firms in Collin County",
      "North DFW households who want wealth management without a branch appointment",
      "Investors in Frisco, Prosper, and nearby communities seeking clear program rates",
    ],
    processSteps: [
      {
        title: "Apply from Frisco",
        body: "Complete signup and identity verification online from Frisco or anywhere in North Texas — no in-person visit required.",
      },
      {
        title: "Pick savings, FD, or wealth",
        body: "Review published terms on the rates page, then choose the account type that matches your timeline.",
      },
      {
        title: "Fund and monitor in the portal",
        body: "After approval, fund your account and track balances and statements 24/7. Phone support: +1 (469) 754-2201.",
      },
    ],
    whyLocal: [
      "Frisco searches for financial advisors and investment firms often assume a storefront. We serve Frisco honestly as part of statewide online Texas coverage — clearer than inventing a local address for Maps.",
      "Many Frisco and Collin County professionals prefer remote onboarding that fits hybrid schedules.",
      "Compare /compare and /rates before you enroll, then review agreements in the portal.",
    ],
    keywords: [
      "Investment Firm Frisco",
      "Investment Advisor Frisco TX",
      "Financial Advisor Frisco",
      "Wealth Management Frisco",
      "Investment Management Frisco",
      "Financial Services Frisco TX",
      "Wealth Management Frisco TX",
      "Investment Firm Collin County",
    ],
    faqs: [
      {
        q: "Does AWS Vision serve Frisco, Texas?",
        a: "Yes. Frisco and North DFW clients open savings, fixed deposit, and wealth management accounts online with remote KYC.",
      },
      {
        q: "Do you have an office in Frisco?",
        a: "No public Frisco retail storefront. Clients are served remotely by portal, phone, and email as part of our Texas service-area model.",
      },
      {
        q: "Can I get wealth management from Frisco without visiting a branch?",
        a: "Yes. Apply online, complete KYC, fund your plan, and track statements in the client portal.",
      },
    ],
  },
  {
    slug: "mckinney",
    name: "McKinney",
    metro: "Dallas–Fort Worth (DFW) · Collin County",
    headline: "Investment firm & wealth management for McKinney, TX",
    intro:
      "AWS Vision Financial serves McKinney and Collin County clients online — investment management, wealth plans, savings, and fixed deposits with remote KYC. No McKinney retail branch required.",
    localFocus: [
      "McKinney households comparing online investment firms in Collin County",
      "Professionals who want wealth management without driving to a branch",
      "Investors near McKinney, Allen, and Fairview seeking clear program terms",
    ],
    processSteps: [
      {
        title: "Apply from McKinney",
        body: "Complete signup and KYC online from McKinney or anywhere in North Texas — no in-person appointment required.",
      },
      {
        title: "Choose savings, FD, or wealth",
        body: "Review current terms on the rates page, then select the plan that matches your timeline.",
      },
      {
        title: "Fund and track in the portal",
        body: "After approval, fund your account and monitor balances and statements remotely. Phone: +1 (469) 754-2201.",
      },
    ],
    whyLocal: [
      "McKinney “financial advisor near me” results often push storefronts. We serve McKinney honestly as part of statewide online Texas coverage — no invented local address for Maps.",
      "Collin County clients who travel or work hybrid schedules often prefer remote onboarding and digital statements.",
      "Use /compare and /rates before you enroll, then review agreements in the portal.",
    ],
    keywords: [
      "Investment Firm McKinney",
      "Investment Advisor McKinney TX",
      "Financial Advisor McKinney",
      "Wealth Management McKinney",
      "Investment Management McKinney",
      "Financial Services McKinney TX",
      "Wealth Management Collin County",
    ],
    faqs: [
      {
        q: "Does AWS Vision serve McKinney, Texas?",
        a: "Yes. McKinney and Collin County clients open savings, fixed deposit, and wealth management accounts online with remote KYC.",
      },
      {
        q: "Do you have an office in McKinney?",
        a: "No public McKinney retail storefront. Clients are served remotely by portal, phone, and email.",
      },
      {
        q: "Can I manage a wealth plan from McKinney online?",
        a: "Yes. Apply online, complete KYC, fund your plan, and track statements in the client portal.",
      },
    ],
  },
  {
    slug: "arlington",
    name: "Arlington",
    metro: "Dallas–Fort Worth (DFW) · Tarrant County",
    headline: "Investment accounts & wealth plans for Arlington, TX",
    intro:
      "Arlington and mid-cities DFW clients can open AWS Vision savings, fixed deposit, and wealth management accounts online — statewide Texas service with remote support, no Arlington retail branch.",
    localFocus: [
      "Arlington households comparing online investment firms between Dallas and Fort Worth",
      "Mid-cities professionals who want portfolio tracking without a branch visit",
      "Investors seeking transparent rates before they enroll",
    ],
    processSteps: [
      {
        title: "Enroll from Arlington",
        body: "Signup and KYC are fully online for Arlington, Grand Prairie, and nearby mid-cities communities.",
      },
      {
        title: "Pick your product",
        body: "Choose savings, FD, or wealth tiers after reviewing published terms on the rates page.",
      },
      {
        title: "Stay connected",
        body: "Use the portal for statements; call or email support anytime — +1 (469) 754-2201.",
      },
    ],
    whyLocal: [
      "Arlington sits between Dallas and Fort Worth — clients often want one online firm that covers the whole metro without fake storefront claims. That is our model.",
      "Compare bank-style products on /compare, then open an account remotely if the fit is right.",
    ],
    keywords: [
      "Investment Firm Arlington TX",
      "Financial Advisor Arlington Texas",
      "Wealth Management Arlington TX",
      "Investment Advisor Arlington",
      "Financial Services Arlington TX",
      "Investment Management Arlington",
    ],
    faqs: [
      {
        q: "Can Arlington residents open an AWS Vision account?",
        a: "Yes. Complete online KYC, then fund savings, FD, or wealth plans through the portal.",
      },
      {
        q: "Is there an Arlington branch?",
        a: "No. We serve Arlington remotely as part of our Texas service-area model.",
      },
    ],
  },
];

/** Featured (richer) + light city pages — all served at /serving-texas/[slug] */
export const TEXAS_CITIES: TexasCity[] = (() => {
  const featured = TEXAS_CITIES_FEATURED;
  const featuredSlugs = new Set(featured.map((c) => c.slug));
  const light = getLightTexasCities().filter((c) => !featuredSlugs.has(c.slug));
  return [...featured, ...light];
})();

export function getTexasCity(slug: string) {
  return TEXAS_CITIES.find((c) => c.slug === slug) ?? null;
}
