import {
  PiggyBank,
  CreditCard,
  Home,
  Car,
  Briefcase,
  LineChart,
  Smartphone,
  Calendar,
  Receipt,
  Vault,
  Target,
  Building2,
  TrendingUp,
  MapPin,
  MessageCircle,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { SITE } from "@/lib/site-config";

/** Homepage product tabs — AWS Vision core offerings first */
export const PRODUCT_TABS: {
  label: string;
  shortLabel: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { label: "Savings", shortLabel: "Savings", href: "/personal/savings", icon: PiggyBank },
  { label: "Fixed Deposits", shortLabel: "Fixed Dep.", href: "/personal/cds", icon: Vault },
  { label: "Investing", shortLabel: "Investing", href: "/wealth-management", icon: LineChart },
  { label: "Credit Cards", shortLabel: "Cards", href: "/credit-cards", icon: CreditCard },
  { label: "Home Loans", shortLabel: "Home", href: "/home-loans", icon: Home },
  { label: "Auto Loans", shortLabel: "Auto", href: "/auto-loans", icon: Car },
  { label: "Small Business", shortLabel: "Business", href: "/small-business", icon: Briefcase },
  { label: "Get the Free App", shortLabel: "Free App", href: "/online-banking#mobile", icon: Smartphone },
  { label: "Schedule Appointment", shortLabel: "Schedule", href: "/contact#appointment", icon: Calendar },
];

export const BETTER_MONEY_HABITS: {
  title: string;
  href: string;
  image: string;
  icon: LucideIcon;
}[] = [
  {
    title: "How does a home equity line of credit work—and how can it help?",
    href: "/financial-education#heloc",
    image: "bg-gradient-to-br from-sky-600 to-sky-800",
    icon: Home,
  },
  {
    title: "8 common bank fees—and how to avoid them",
    href: "/financial-education#fees",
    image: "bg-gradient-to-br from-teal-600 to-teal-800",
    icon: Receipt,
  },
  {
    title: "What is a certificate of deposit (CD) and how does it work?",
    href: "/personal/cds",
    image: "bg-gradient-to-br from-amber-600 to-amber-800",
    icon: Vault,
  },
  {
    title: "Retrain your brain for savings success with these money-saving challenges",
    href: "/financial-education#savings-challenges",
    image: "bg-gradient-to-br from-violet-600 to-violet-800",
    icon: Target,
  },
  {
    title: "Understanding your mortgage options",
    href: "/home-loans",
    image: "bg-gradient-to-br from-slate-700 to-slate-900",
    icon: Building2,
  },
  {
    title: "How to build credit from scratch",
    href: "/financial-education#credit",
    image: "bg-gradient-to-br from-rose-600 to-rose-800",
    icon: TrendingUp,
  },
];

export const NEWS_ITEMS = [
  {
    title: "Level up your account security",
    desc: "Watch your security meter rise as you take action to help protect against fraud. See it in the Security Center in Mobile and Online Banking.",
    href: "/security",
    cta: "Check your account security level",
  },
  {
    title: "Convenient banking with our Mobile app",
    desc: "Set customizable alerts, mobile check deposit, and use your fingerprint or face ID for quicker access. Your activities are protected by industry-leading security features.",
    href: "/online-banking#mobile",
    cta: "Explore our mobile app",
  },
  {
    title: "AWS Vision Q1 Performance Report",
    desc: "AWS Vision delivered strong performance in Q1 2026, recording an impressive 40% profit despite global economic turbulence.",
    href: "/news#q1-2026",
    cta: "Read the report",
  },
  {
    title: "Introducing the AWS Vision Dashboard",
    desc: "Your window into real-time performance and precision. Track investments, earnings, and portfolio analytics in one world-class dashboard.",
    href: "/login",
    cta: "Access your dashboard",
  },
];

export const CONNECT_LINKS: {
  label: string;
  href: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
}[] = [
  {
    label: "Schedule an appointment",
    href: "/contact#appointment",
    desc: "Meet with a specialist in person, by phone, or video",
    icon: Calendar,
    accent: "group-hover:border-sky-300",
    iconBg: "bg-gradient-to-br from-sky-500 to-sky-700",
  },
  {
    label: "Find a location",
    href: "/contact#branches",
    desc: "Visit our Delaware headquarters or UAE operations",
    icon: MapPin,
    accent: "group-hover:border-teal-300",
    iconBg: "bg-gradient-to-br from-teal-500 to-teal-700",
  },
  {
    label: "Contact us",
    href: "/contact",
    desc: "Phone, email, and message form",
    icon: MessageCircle,
    accent: "group-hover:border-violet-300",
    iconBg: "bg-gradient-to-br from-violet-500 to-violet-700",
  },
  {
    label: "Help center",
    href: "/help",
    desc: "FAQs, guides, and account support",
    icon: HelpCircle,
    accent: "group-hover:border-amber-300",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-700",
  },
];

export const MOBILE_APP_FEATURES = [
  "Set customizable alerts",
  "Mobile check deposit",
  "Use your fingerprint or face ID for quicker access",
  "Lock or unlock your debit and credit cards",
  "AWS Vision Pay — send money instantly",
  "Investment portal with real-time portfolio charts",
  "Bill Pay and wire transfers",
  "Schedule appointments",
];

export const FAQ_CATEGORIES = [
  {
    title: "Accounts & Banking",
    items: [
      { q: "What accounts does AWS Vision offer?", a: "We offer Savings accounts, Fixed Deposit (FD) accounts, and Investment accounts. We do not offer checking accounts. Savings and FD clients receive monthly and yearly gratuity; investment clients receive monthly profit from our global sector portfolios." },
      { q: "How do I open a savings or FD account?", a: "Apply online at awsvision.com/signup in about 10–15 minutes. You'll need a valid ID, Social Security number, and funding source." },
      { q: "How are investment profits paid?", a: "AWS Vision offers six structured investment plans (Silver through Executive) with monthly profit rates from 2% to 7% over terms of 24 to 60 months. Profits are credited monthly; compound interest and capital reinvestment are available on all tiers." },
      { q: "How do I avoid monthly maintenance fees?", a: "Each account tier has waiver options — direct deposit, minimum balance, or AWS Vision Preferred Rewards membership. See Clarity Statements on each product page." },
      { q: "What is Keep the Change®?", a: "Enroll through Online Banking. We round up debit card purchases to the nearest dollar and transfer the difference to your savings account." },
      { q: "How do I enroll in Online Banking?", a: "Click Enroll on the homepage or visit awsvision.com/signup. You'll need your account number, SSN/Tax ID, and email." },
    ],
  },
  {
    title: "Investments & Portfolio",
    items: [
      { q: "What returns can I expect?", a: "Investment-linked accounts offer tiered returns from 6% to 96% p.a. based on capital tier. Monthly profits are credited to your account." },
      { q: "How do I track my investments?", a: "Sign in to the client portal to see real-time holdings by sector, region, stock, and fund with advanced charts." },
      { q: "How do I download monthly statements?", a: "Portal → Statements → Download PDF. Professional format with full transaction details." },
      { q: "Can I withdraw my capital?", a: "Yes. Place a withdrawal request in the portal for savings and investment accounts. For fixed deposits, contact your relationship manager to initiate an early withdrawal." },
    ],
  },
  {
    title: "Loans & Credit",
    items: [
      { q: "How do I apply for a home loan?", a: "Use the AWS Vision Digital Mortgage Experience® to prequalify, apply, or refinance online. Track progress in Home Loan Navigator®." },
      { q: "What credit cards do you offer?", a: "Customized Cash Rewards, Travel Rewards, Unlimited Cash Rewards, student cards, and business cards. Filter by no annual fee, balance transfer, and rewards type." },
      { q: "Do Preferred Rewards members get rate discounts?", a: "Yes. Up to 0.25% off eligible new auto, personal, business, and mortgage loans." },
    ],
  },
  {
    title: "Security & Support",
    items: [
      { q: "How do I report fraud?", a: `Call ${SITE.phone} immediately or lock your card in the mobile app. Email ${SITE.email}.` },
      { q: "Is my money FDIC insured?", a: "Deposit products are FDIC insured up to $250,000 per depositor. Investment products are not FDIC insured and may lose value." },
      { q: "How do I reset my Online ID or passcode?", a: "Use Forgot ID/Passcode on the login page or contact us for assistance." },
    ],
  },
];

export const NEWS_ARTICLES = [
  {
    id: "q1-2026",
    date: "April 2026",
    title: "AWS Vision Q1 Performance Report",
    excerpt: "AWS Vision has delivered strong performance in Q1 2026, recording an impressive 40% profit despite global economic turbulence, including heightened trade tensions.",
    body: "Our quantitative models and algorithmic trading systems continued to outperform traditional benchmarks. Client payout distributions remained consistent, supported by our performance reserve and adaptive investment tactics.",
  },
  {
    id: "q1-2025",
    date: "April 2025",
    title: "AWS Vision Q1 2025 Performance Report",
    excerpt: "AWS Vision delivered stable performance in Q1 2025 as we expanded our client base and refined our algorithmic asset management platform.",
    body: "We continued building toward our mission of quantitative fintech-driven investing with transparent client reporting and portfolio analytics.",
  },
  {
    id: "dashboard",
    date: "March 2025",
    title: "Introducing the AWS Vision Dashboard",
    excerpt: "Your window into real-time performance and precision. Our world-class dashboard empowers investors with detailed analytics and easy navigation.",
    body: "Track investments, earnings, and portfolio performance with advanced charts. Download monthly profit statements, place deposit and withdrawal requests, and monitor sector allocation — all from one secure platform.",
  },
  {
    id: "media",
    date: "April 2025",
    title: "Featured in Bloomberg, CNBC, Yahoo Finance & More",
    excerpt: "AWS Vision's approach to structured yield solutions and fintech-driven asset management was covered across leading financial media outlets.",
    body: "The article highlighted our data-driven investment precision, multi-asset expertise, and flexible client-focused solutions for high-net-worth individuals and institutional investors.",
  },
];

export const HOME_STATS = [
  { value: "7%", label: "Max Monthly Profit" },
  { value: "420%", label: "Executive Total ROI" },
  { value: "80+", label: "Active Clients" },
  { value: "$1.8M", label: "Assets Under Management (USD)" },
];
