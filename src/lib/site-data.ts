import {
  ArrowRight,
  Building2,
  Car,
  CreditCard,
  Globe,
  Home,
  Landmark,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { getFdPromoSummary } from "@/lib/promotions";

export { SITE, OFFICES, BRANCHES, US_HEADQUARTERS, MARYLAND_HEADQUARTERS, REGISTERED_OFFICE, SITE_PHONES, formatUsHeadquarters, formatSitePhones, formatSitePhonesMultiline } from "./site-config";

/** TEAMBASED Tax Services — legal & financial advisory partner */
export const TEAMBASED_TAX_URL = "https://tbtaxservice.com/";

export const MAIN_NAV = [
  {
    label: "Personal",
    href: "/personal",
    sections: [
      {
        title: "Bank Accounts",
        links: [
          { label: "Savings Accounts", href: "/personal/savings", desc: "Monthly & yearly gratuity — open now" },
          { label: "Fixed Deposits (FD)", href: "/personal/cds", desc: "Fixed term with gratuity benefits — open now" },
          { label: "Investment Accounts", href: "/wealth-management", desc: "Global sectors, monthly profit — open now" },
          { label: "Compare Accounts", href: "/personal", desc: "Savings, FD, and investment options" },
        ],
      },
      {
        title: "Credit Cards",
        links: [
          { label: "All Credit Cards", href: "/credit-cards", desc: "Opening soon — join the waitlist" },
          { label: "Platinum Card", href: "/credit-cards#platinum", desc: "Premium benefits for investors" },
          { label: "Rewards Program", href: "/credit-cards#rewards", desc: "Earn points on every purchase" },
        ],
      },
      {
        title: "Loans",
        links: [
          { label: "Home Loans & Mortgage", href: "/home-loans", desc: "Opening soon — preview home lending" },
          { label: "Auto Loans", href: "/auto-loans", desc: "Opening soon — vehicle financing" },
          { label: "Personal Loans", href: "/personal-loans", desc: "Opening soon — personal lending" },
          { label: "Student Banking", href: "/student-banking", desc: "Opening soon — student accounts" },
        ],
      },
    ],
  },
  {
    label: "Investing",
    href: "/wealth-management",
    sections: [
      {
        title: "Wealth Management",
        links: [
          { label: "Investment Accounts", href: "/wealth-management", desc: "Available now — open online" },
          { label: "Compare vs Big Banks", href: "/compare", desc: "AWS Vision vs BoA, Chase, Wells Fargo & more" },
          { label: "Portfolio Monitoring", href: "/login", desc: "Track stocks, funds, and sectors live" },
          { label: "Monthly Statements", href: "/login", desc: "Download professional profit reports" },
          { label: "Retirement Planning", href: "/wealth-management#retirement", desc: "IRA and 401(k) rollover services" },
        ],
      },
      {
        title: "Markets",
        links: [
          { label: "Global Equities", href: "/wealth-management#markets", desc: "North America, Europe, Asia Pacific" },
          { label: "Fixed Income", href: "/wealth-management#markets", desc: "Bonds and treasury portfolios" },
          { label: "Real Estate Funds", href: "/wealth-management#markets", desc: "Commercial and residential REITs" },
        ],
      },
    ],
  },
  {
    label: "Non-Profit",
    href: "/nonprofit",
    sections: [
      {
        title: "Organization Funds",
        links: [
          { label: "Non-Profit Fund Program", href: "/nonprofit", desc: "8%–10% monthly returns for tax-exempt organizations" },
          { label: "Open Non-Profit Account", href: "/signup/nonprofit", desc: "Enroll from $100K to $1M fund capital" },
          { label: "Organization Sign In", href: "/login", desc: "Access your non-profit organization portal" },
        ],
      },
      {
        title: "Program Details",
        links: [
          { label: "Monthly Return Tiers", href: "/nonprofit", desc: "$100K to $1M capital — scaled monthly profit" },
          { label: "Rates & Returns", href: "/rates", desc: "Compare FD and investment program rates" },
          { label: "Contact Our Team", href: "/contact", desc: "Speak with a relationship manager" },
        ],
      },
    ],
  },
  {
    label: "Business",
    href: "/small-business",
    sections: [
      {
        title: "Small Business",
        links: [
          { label: "Business Checking", href: "/small-business#checking", desc: "Accounts built for growing companies" },
          { label: "Business Credit Cards", href: "/small-business#cards", desc: "Manage expenses and earn rewards" },
          { label: "Business Loans", href: "/small-business#loans", desc: "Lines of credit and term loans" },
          { label: "Merchant Services", href: "/small-business#merchant", desc: "Accept payments anywhere" },
        ],
      },
      {
        title: "Commercial",
        links: [
          { label: "Corporate Banking", href: "/small-business#corporate", desc: "Treasury and cash management" },
          { label: "Payroll Services", href: "/small-business#payroll", desc: "Pay employees on time, every time" },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/online-banking",
    sections: [
      {
        title: "Digital Banking",
        links: [
          { label: "Online Banking", href: "/online-banking", desc: "Bank from anywhere, 24/7" },
          { label: "Mobile App", href: "/online-banking#mobile", desc: "Full banking in your pocket" },
          { label: "Bill Pay & Transfers", href: "/online-banking#transfers", desc: "Pay bills and send money instantly" },
          { label: "Wire Transfers", href: "/online-banking#wire", desc: "Domestic and international wires" },
        ],
      },
      {
        title: "Protection",
        links: [
          { label: "Insurance", href: "/insurance", desc: "Life, health, and investment protection" },
          { label: "Security Center", href: "/security", desc: "Fraud protection and account safety" },
          { label: "Identity Monitoring", href: "/security#identity", desc: "24/7 identity theft protection" },
        ],
      },
      {
        title: "Advisory & Legal",
        links: [
          { label: "Legal Services", href: TEAMBASED_TAX_URL, desc: "Tax and legal counsel via TEAMBASED Tax Services" },
          { label: "Financial Advisory", href: TEAMBASED_TAX_URL, desc: "Professional financial planning and advisory" },
        ],
      },
    ],
  },
];

export const FOOTER_LINKS = {
  personal: [
    { label: "Savings", href: "/personal/savings" },
    { label: "Fixed Deposits (FD)", href: "/personal/cds" },
    { label: "Investment Accounts", href: "/wealth-management" },
    { label: "Credit Cards", href: "/credit-cards" },
    { label: "Home Loans", href: "/home-loans" },
    { label: "Auto Loans", href: "/auto-loans" },
    { label: "Personal Loans", href: "/personal-loans" },
    { label: "Student Banking", href: "/student-banking" },
  ],
  business: [
    { label: "Small Business", href: "/small-business" },
    { label: "Business Checking", href: "/small-business#checking" },
    { label: "Business Loans", href: "/small-business#loans" },
    { label: "Merchant Services", href: "/small-business#merchant" },
    { label: "Payroll", href: "/small-business#payroll" },
  ],
  nonprofit: [
    { label: "Non-Profit Fund Program", href: "/nonprofit" },
    { label: "Open Non-Profit Account", href: "/signup/nonprofit" },
    { label: "Organization Sign In", href: "/login" },
    { label: "Rates & Returns", href: "/rates" },
  ],
  investing: [
    { label: "Wealth Management", href: "/wealth-management" },
    { label: "Compare vs Big Banks", href: "/compare" },
    { label: "Investment Portal", href: "/login" },
    { label: "Retirement", href: "/wealth-management#retirement" },
    { label: "Rates & Returns", href: "/rates" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Schedule Appointment", href: "/contact#appointment" },
    { label: "Security", href: "/security" },
    { label: "Financial Education", href: "/financial-education" },
    { label: "Referral Program", href: "/referral-program" },
    { label: "Legal Services", href: TEAMBASED_TAX_URL },
    { label: "Financial Advisory", href: TEAMBASED_TAX_URL },
  ],
  company: [
    { label: "About AWS Vision", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Investor Relations", href: "/about#investors" },
    { label: "Privacy Policy", href: "/about#privacy" },
    { label: "Terms & Conditions", href: "/about#terms" },
  ],
};

export const HOME_PROMOS = [
  {
    title: "AWS Vision Credit Cards — Launching Soon",
    desc: "Preview our full Visa lineup — Customized Cash, Travel, Premium, Student & Business cards branded with the AWS Vision logo. Join the waitlist today.",
    cta: "Preview Cards",
    href: "/credit-cards",
    accent: "from-teal-600 to-teal-800",
  },
  {
    title: "Open a Fixed Deposit — Plan-Aligned Rates",
    desc: `FD tiers from Silver through Executive mirror our investment plan returns — 2% to 7% monthly gratuity and up to 420% total return. ${getFdPromoSummary()}.`,
    cta: "Open FD Account",
    href: "/signup",
    accent: "from-slate-800 to-slate-950",
  },
  {
    title: "Digital Mortgage Experience® — Launching Soon",
    desc: "Preview our home loan lineup — 30-year fixed, 15-year fixed, HELOC, and Affordable Loan Solution®. Join the waitlist to apply when lending launches.",
    cta: "Preview Home Loans",
    href: "/home-loans",
    accent: "from-sky-600 to-sky-800",
  },
];

export const HOME_QUICK_LINKS = [
  { icon: Wallet, label: "Open an Account", href: "/signup" },
  { icon: Landmark, label: "Sign In to Online Banking", href: "/login" },
  { icon: TrendingUp, label: "Investment Portal", href: "/login" },
  { icon: CreditCard, label: "Credit Cards", href: "/credit-cards" },
  { icon: Home, label: "Home Loans", href: "/home-loans" },
  { icon: Car, label: "Auto Loans", href: "/auto-loans" },
  { icon: Building2, label: "Small Business", href: "/small-business" },
  { icon: Smartphone, label: "Mobile Banking", href: "/online-banking#mobile" },
];

export const RATES_DATA = {
  savings: [
    { product: "AWS Vision Advantage Savings", min: "$100", max: "No max", rate: "0.01%", apy: "0.01%" },
    { product: "Advantage Savings (Preferred Rewards Platinum)", min: "$100", max: "No max", rate: "0.04%", apy: "0.04%" },
    { product: "Investment Savings — Starter Tier", min: "$1,000", max: "$9,999", rate: "6.00%/mo", apy: "72.00% annual simple" },
    { product: "Investment Savings — Growth Tier", min: "$10,000", max: "$99,999", rate: "7.50%/mo", apy: "90.00% annual simple" },
    { product: "Investment Savings — Elite Tier", min: "$100,000", max: "$249,999", rate: "9.50%/mo", apy: "114.00% annual simple" },
  ],
  loans: [
    { product: "30-Year Fixed Mortgage", rate: "6.875%", apr: "6.991%", type: "Home" },
    { product: "15-Year Fixed Mortgage", rate: "6.125%", apr: "6.289%", type: "Home" },
    { product: "Affordable Loan Solution®", rate: "6.500%", apr: "6.712%", type: "Home" },
    { product: "Auto Loan (New, 60 mo)", rate: "5.49%", apr: "5.62%", type: "Auto" },
    { product: "Personal Loan", rate: "7.99%", apr: "8.15%", type: "Personal" },
    { product: "Business Line of Credit", rate: "9.99%", apr: "10.25%", type: "Business" },
  ],
  creditCards: [
    { product: "Customized Cash Rewards", purchaseAPR: "17.49%–27.49%", balanceTransfer: "0% for 15 mo", annualFee: "$0" },
    { product: "Travel Rewards", purchaseAPR: "17.49%–27.49%", balanceTransfer: "0% for 15 mo", annualFee: "$0" },
    { product: "Premium Rewards", purchaseAPR: "17.49%–27.49%", balanceTransfer: "0% for 15 mo", annualFee: "$95" },
  ],
  checking: [
    { product: "Advantage SafeBalance Banking®", monthlyFee: "$4.95", waiver: "Under 25, $500 balance, or Preferred Rewards" },
    { product: "Advantage Plus Banking®", monthlyFee: "$12.00", waiver: "$250 direct deposit, $1,500 balance, or Preferred Rewards" },
    { product: "Advantage Relationship Banking®", monthlyFee: "$25.00", waiver: "$20,000 balance or Preferred Rewards Gold+" },
  ],
};

export { SERVICE_PAGES } from "./service-pages-content";

export const EDUCATION_ARTICLES = [
  { title: "Savings account vs CD: Which should I choose?", category: "Savings", readTime: "5 min", desc: "With a savings account you have easy access to your money. A CD typically pays more interest, but access is limited until maturity." },
  { title: "Understanding your mortgage options", category: "Home", readTime: "10 min", desc: "With so many different mortgages available, choosing one may seem overwhelming. Learn about fixed-rate, ARM, FHA, and VA loans." },
  { title: "How to build credit from scratch", category: "Credit", readTime: "6 min", desc: "Tips for establishing credit history with a student card, secured card, or becoming an authorized user." },
  { title: "What is Preferred Rewards?", category: "Banking", readTime: "4 min", desc: "Learn how combining eligible AWS Vision accounts can unlock fee waivers, interest rate boosts, and credit card bonus rewards." },
  { title: "Homebuying: What to expect from the process", category: "Home", readTime: "8 min", desc: "From prequalification to closing — understand each stage of buying your first home with AWS Vision." },
  { title: "Small business cash flow management", category: "Business", readTime: "7 min", desc: "Use Cash Flow Monitor to track credits, debits, and projections. Connect QuickBooks and ADP to your dashboard." },
  { title: "Protecting yourself from fraud and identity theft", category: "Security", readTime: "5 min", desc: "Never share your Online ID or passcode. Enable alerts, use biometric login, and review accounts regularly." },
  { title: "Retirement planning: IRA vs 401(k)", category: "Retirement", readTime: "8 min", desc: "Compare Traditional IRA, Roth IRA, and 401(k) rollover options available through AWS Vision Wealth Management." },
  { title: "How Keep the Change® builds your savings", category: "Savings", readTime: "3 min", desc: "Round up debit card purchases to the nearest dollar and automatically transfer the difference to savings." },
  { title: "Investment portfolio monitoring explained", category: "Investing", readTime: "5 min", desc: "Learn how to read your monthly profit statement, sector allocation charts, and holdings detail in the client portal." },
];
