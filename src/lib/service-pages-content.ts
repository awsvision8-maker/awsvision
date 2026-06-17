import {
  Banknote,
  Briefcase,
  Car,
  CreditCard,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  LineChart,
  PiggyBank,
  Smartphone,
  Wallet,
} from "lucide-react";
import { SITE } from "@/lib/site-config";
import { buildFdProducts } from "@/lib/fd-rates";
import { getCdsPromoHero, getActiveFdPromo } from "@/lib/promotions";

export const SERVICE_PAGES = {
  checking: {
    title: "AWS Vision Advantage Banking®",
    subtitle: "Checking accounts that fit the way you live — opening soon",
    hero: "Preview AWS Vision Advantage Banking® — SafeBalance, Plus, and Relationship checking. Join the waitlist to be notified when checking accounts open. Savings, FD, and Investment accounts are available now.",
    icon: Wallet,
    features: [
      { title: "AWS Vision SafeBalance Banking®", desc: "If you're looking for simple banking, SafeBalance provides a straightforward, easy-to-use experience. No paper checks, no overdraft item fees — transactions are made with your debit card, AWS Vision Pay, and digital banking." },
      { title: "AWS Vision Advantage Plus Banking®", desc: "Flexible checking with check writing, mobile check deposit, and Balance Connect® overdraft protection. Link up to five backup accounts — checking, savings, or eligible brokerage — with no transfer fee." },
      { title: "AWS Vision Advantage Relationship Banking®", desc: "Interest-bearing checking for clients who want the most from their banking relationship. Tiered rates on all balances with premium features and fee waivers through Preferred Rewards." },
      { title: "Mobile Check Deposit", desc: "Deposit checks using the AWS Vision Mobile Banking app. Funds are usually available the next business day when deposited before the applicable cutoff time." },
      { title: "Debit Card with $0 Liability Guarantee", desc: "Every account includes a contactless Visa debit card. If your card is lost or stolen, you're not responsible for unauthorized transactions when reported promptly." },
      { title: "AWS Vision Preferred Rewards®", desc: "Enroll in Preferred Rewards to waive monthly maintenance fees, earn interest rate boosts on savings, and get credit card rewards bonuses up to 75%." },
    ],
    products: [
      {
        name: "AWS Vision Advantage SafeBalance Banking®",
        rate: "$4.95/mo or $0",
        desc: "Opening deposit: $25 or more. Best for students and digital-first banking.",
        features: [
          "No monthly fee if account owner is under 25",
          "Waived with $500 minimum daily balance",
          "Waived for Preferred Rewards members",
          "No overdraft item fees — transactions declined if insufficient funds",
          "Debit card, AWS Vision Pay, and mobile banking included",
        ],
      },
      {
        name: "AWS Vision Advantage Plus Banking®",
        rate: "$12/mo or $0",
        desc: "Opening deposit: $100 or more. Our most popular checking account.",
        features: [
          "Waived with $250+ qualifying direct deposit per statement cycle",
          "Waived with $1,500 minimum daily balance",
          "Check writing, Bill Pay, and Balance Connect® included",
          "Mobile and online banking with printable statements",
          "Overdraft fee: $10 per item, max 2 per day (only if overdrawn by more than $1)",
        ],
      },
      {
        name: "AWS Vision Advantage Relationship Banking®",
        rate: "$25/mo or $0",
        desc: "Opening deposit: $100 or more. Interest-bearing premium checking.",
        features: [
          "Waived with $20,000 minimum daily balance",
          "Waived for Preferred Rewards Gold tier and above",
          "Earn tiered interest: up to 0.02% APY on balances $50,000+",
          "All Plus features plus priority support",
          "Link to Advantage Savings for combined relationship benefits",
        ],
      },
    ],
    faqs: [
      { q: "How do I avoid the monthly maintenance fee?", a: "Each checking tier has specific waiver requirements — such as direct deposit, minimum balance, or Preferred Rewards membership. Review the Clarity Statement for your account at awsvision.com for full details." },
      { q: "What is Balance Connect®?", a: "Balance Connect automatically transfers funds from a linked AWS Vision savings, checking, or eligible brokerage account to cover purchases when your checking balance is insufficient. You can link up to five accounts with no transfer fee." },
      { q: "Can I open a checking account online?", a: "Yes. Apply online in about 10 minutes at awsvision.com. You'll need a valid government ID, Social Security number or Tax ID, and a funding source for your opening deposit." },
      { q: "How do I get the most out of my new account?", a: `Review all features at awsvision.com after opening. Email ${SITE.email} or call ${SITE.phone} for personalized help.` },
    ],
    cta: { label: "Open a Checking Account", href: "/contact#coming-soon" },
  },

  savings: {
    title: "AWS Vision Savings Accounts",
    subtitle: "Monthly and yearly gratuity on your savings — available now",
    hero: "Open a Savings account with AWS Vision and receive gratuity on a monthly and yearly basis. Your capital grows with structured benefits while you prepare for investment or fixed deposit options.",
    icon: PiggyBank,
    features: [
      { title: "Monthly Gratuity", desc: "Eligible savings balances receive a monthly gratuity credit — paid directly to your account and visible in your client portal statement." },
      { title: "Yearly Gratuity", desc: "In addition to monthly benefits, qualified accounts receive an annual gratuity payment at the end of each membership year." },
      { title: "Secure Capital Storage", desc: "Park funds safely before moving to a Fixed Deposit or Investment account. Full transaction history and balance tracking in Online Banking." },
      { title: "Link to Investment Portfolio", desc: "Transfer from savings into an Investment account when you are ready. AWS Vision invests across global sectors on your behalf with monthly profit distribution." },
      { title: "Multiple Savings Goals", desc: "Open separate savings accounts for different goals — emergency fund, FD funding, or investment capital." },
      { title: "Client Portal Access", desc: "View gratuity credits, deposits, withdrawals, and monthly statements. Download PDF reports anytime from your portal." },
    ],
    products: [
      {
        name: "AWS Vision Savings Account",
        rate: "Monthly + yearly gratuity",
        desc: "Minimum opening deposit: $100.",
        features: [
          "Monthly gratuity credited to your account",
          "Yearly gratuity for qualifying balances",
          "Transfer to FD or Investment anytime",
          "Full portal statements and history",
          "Dedicated client support",
        ],
      },
      {
        name: "Premium Savings Tier",
        rate: "Enhanced gratuity",
        desc: "Higher balances qualify for enhanced monthly and yearly gratuity.",
        features: [
          "Higher monthly gratuity rate",
          "Enhanced yearly gratuity bonus",
          "Priority relationship manager",
          "Faster transfer to investment tiers",
        ],
      },
    ],
    faqs: [
      { q: "What is monthly and yearly gratuity?", a: "Gratuity is a benefit AWS Vision credits to your Savings account on a monthly schedule, with an additional yearly gratuity for qualifying accounts. Amounts depend on your balance tier and account terms." },
      { q: "Does AWS Vision offer checking accounts?", a: "No. We offer Savings, Fixed Deposit (FD), and Investment accounts only. We do not provide checking or everyday transaction accounts." },
      { q: "How do I move from savings to investment?", a: "Once your savings goal is met, transfer funds to an Investment account from your portal. AWS Vision will allocate capital across global sectors and pay monthly profit to your account." },
    ],
    cta: { label: "Open a Savings Account", href: "/signup" },
  },

  cds: {
    title: "AWS Vision Fixed Deposit (FD) Accounts",
    subtitle: "Fixed term with monthly and yearly gratuity — available now",
    hero: "Lock your capital in a Fixed Deposit for a chosen term. FD tiers follow the same monthly gratuity and total return schedule as our Silver through Executive investment plans — plus a limited monthly featured promo at 90% total return over 6 months on $50,000+.",
    icon: Banknote,
    features: [
      { title: "Monthly Gratuity on FD", desc: "Receive a monthly gratuity credit on your fixed deposit balance throughout the term of your account." },
      { title: "Yearly Gratuity Bonus", desc: "Qualifying fixed deposits earn an additional yearly gratuity payment — rewarding long-term commitment." },
      { title: "Fixed Terms", desc: "Choose terms from 3 months to 5 years. Your principal and agreed returns are defined at opening." },
      { title: "Investment-Linked FD", desc: "Higher-tier fixed deposits link directly to AWS Vision's global investment portfolio for enhanced returns and monthly profit options." },
      { title: "Maturity Options", desc: "At maturity, renew your FD, transfer to savings, or move capital into an Investment account." },
      { title: "Portal Statements", desc: "Track gratuity payments, maturity dates, and full account history in your client portal with downloadable PDF statements." },
    ],
    products: buildFdProducts(),
    faqs: [
      { q: "What is gratuity on a fixed deposit?", a: "Gratuity is an additional benefit AWS Vision pays on top of your fixed deposit returns — monthly throughout the term and yearly for qualifying accounts." },
      { q: "Savings vs FD — which should I choose?", a: "Savings offers flexible access with monthly and yearly gratuity. FD locks your capital for a set term with typically higher gratuity and returns. Choose FD when you can commit funds for the full term." },
      { q: "Can I withdraw my FD early?", a: "Fixed deposits are held until maturity. If you need funds before then, contact your relationship manager — they will initiate an early withdrawal on your behalf." },
    ],
    cta: { label: "Open an FD Account", href: "/signup" },
  },

  "credit-cards": {
    title: "AWS Vision Credit Cards",
    subtitle: "Cash back, travel rewards, lower rates, and cards to build credit — launching soon",
    hero: "Preview our full Visa credit card lineup, branded with the AWS Vision logo. Join the waitlist to be notified when applications open. Existing clients can open a bank or investment account today.",
    icon: CreditCard,
    features: [
      { title: "AWS Vision Customized Cash Rewards", desc: "3% cash back in the category of your choice, 2% at grocery stores and wholesale clubs, and unlimited 1% on all other purchases. Change your 3% category once each calendar month in Online Banking or the mobile app." },
      { title: "AWS Vision Travel Rewards", desc: "Earn unlimited 1.5 points per dollar on all purchases. Redeem for travel, cash back, or gift cards. No blackout dates on travel redemptions through AWS Vision Travel Center." },
      { title: "AWS Vision Unlimited Cash Rewards", desc: "Unlimited 1.5% cash back on every purchase. Simple, straightforward rewards with no category tracking required." },
      { title: "Low Intro APR Offers", desc: "Select cards offer 0% intro APR for up to 18 billing cycles on purchases and balance transfers made within the first 60 days. After intro period, variable APR applies." },
      { title: "Preferred Rewards Bonus", desc: "Preferred Rewards members earn 25% to 75% more cash back or points on eligible credit cards depending on membership tier." },
      { title: "$0 Liability Guarantee", desc: "You're not responsible for unauthorized transactions when reported promptly. Lock or unlock your card instantly in the mobile app." },
    ],
    products: [
      {
        name: "AWS Vision® Customized Cash Rewards",
        rate: "No annual fee",
        desc: "6% in choice category first year + $200 online bonus. Variable APR 17.49%–27.49%.",
        features: [
          "3% + 3% first-year bonus in category of your choice",
          "2% at grocery stores and wholesale clubs",
          "Unlimited 1% on all other purchases",
          "0% intro APR 15 billing cycles on purchases & balance transfers",
          "Tap to Pay, Apple Pay, Google Pay ready",
        ],
      },
      {
        name: "AWS Vision® Travel Rewards",
        rate: "No annual fee",
        desc: "25,000 online bonus points after $1,000 spend in first 90 days.",
        features: [
          "Unlimited 1.5 points per $1 on all purchases",
          "No foreign transaction fees",
          "Redeem for travel, cash back, or gift cards",
          "Travel accident insurance included",
          "Preferred Rewards bonus eligible",
        ],
      },
      {
        name: "AWS Vision® Premium Rewards",
        rate: "$95 annual fee",
        desc: "Premium travel and lifestyle benefits for frequent travelers.",
        features: [
          "2 points per $1 on travel and dining",
          "Airport lounge access (4 visits/year)",
          "$100 annual travel credit",
          "No foreign transaction fees",
          "Trip cancellation and baggage delay insurance",
        ],
      },
    ],
    faqs: [
      { q: "How do I change my Customized Cash Rewards category?", a: "Go to Online Banking or the Mobile Banking app. You can change your 3% category once each calendar month, or leave it unchanged." },
      { q: "What is the balance transfer fee?", a: "Intro balance transfer fee of 3% for the first 60 days your account is open. After that, the fee for future balance transfers is 5%." },
      { q: "Can I see customized offers for my credit profile?", a: "Yes. Sign in to Online Banking and visit the Application Center to check for pre-qualified offers without impacting your credit score." },
    ],
    cta: { label: "Join the Waitlist", href: "/contact#notify" },
  },

  "home-loans": {
    title: "Home Mortgage Loans",
    subtitle: "The perfect home starts with the right mortgage — launching soon",
    hero: "Preview our Digital Mortgage Experience®, Home Loan Navigator®, and full home lending lineup. Join the waitlist to be notified when mortgage applications open.",
    icon: Home,
    features: [
      { title: "AWS Vision Digital Mortgage Experience®", desc: "Apply for financing entirely online. Existing clients have many parts of their application auto-populated, saving time and effort. High tech with a personal touch — experienced lending officers available every step." },
      { title: "Home Loan Navigator®", desc: "Track your loan status, upload required documents, electronically sign paperwork, and enroll in PayPlan automatic mortgage payments — all through one online portal at awsvision.com/navigator." },
      { title: "Lock Your Rate", desc: "Avoid the risk of rising rates by locking in your rate when you apply. Rate lock options available for qualified applications." },
      { title: "Affordable Loan Solution® Mortgage", desc: "Programs with lower down payment options for modest-income and first-time homebuyers. Visit our Down Payment Center for programs in your state." },
      { title: "Closing Cost Calculator", desc: "Estimate total closing expenses before you apply. Get a Loan Estimate by speaking with a lending specialist or starting your digital application." },
      { title: "Portfolio Holder Discount", desc: "AWS Vision investment clients receive 0.25% interest rate reduction on eligible new mortgages and refinances." },
    ],
    products: [
      { name: "30-Year Fixed-Rate Mortgage", rate: "See today's rates", desc: "Stable monthly payments for the life of the loan.", features: ["Fixed rate for 30 years", "Conventional, FHA, and VA options", "Down Payment Center programs", "Digital application with prefill", "Home Loan Navigator® tracking"] },
      { name: "15-Year Fixed-Rate Mortgage", rate: "See today's rates", desc: "Pay off your home faster and save on total interest.", features: ["Lower total interest vs 30-year", "Build equity faster", "Fixed rate for 15 years", "Refinance option available online"] },
      { name: "Home Equity Line of Credit (HELOC)", rate: "Variable rate", desc: "Tap your home's equity for renovations, education, or investments.", features: ["Draw funds as needed", "Apply through mobile app with prefill", "Interest may be tax-deductible (consult tax advisor)", "PayPlan enrollment available after approval"] },
      { name: "Affordable Loan Solution®", rate: "Special programs", desc: "Lower down payments for qualifying first-time and modest-income buyers.", features: ["Down payments as low as 3%", "Fixed-rate options", "Visit Down Payment Center for state programs", "Dedicated lending specialist support"] },
    ],
    faqs: [
      { q: "What happens during the home loan process?", a: "The process includes Application & Review, Approval, Closing, Servicing, and First Payment. During Approval you'll receive conditional approval, appraisal results, and a 'clear to close' when all requirements are met." },
      { q: "Can I prequalify without affecting my credit?", a: "Prequalification gives an estimate of what you can borrow and helps narrow your home search. Contact a lending specialist or use the Digital Mortgage Experience to get prequalified." },
      { q: "What is PayPlan?", a: "PayPlan sets up automatic recurring mortgage payments from any AWS Vision checking or savings account. Adjust the draft date or pay extra toward principal anytime through Home Loan Navigator®." },
    ],
    cta: { label: "Join the Loan Waitlist", href: "/contact#loan-notify" },
  },

  "auto-loans": {
    title: "Auto Loans",
    subtitle: "Finance your next vehicle with confidence — launching soon",
    hero: "Preview our new, used, and refinance auto loan products. Join the waitlist to be notified when auto lending applications open at AWS Vision.",
    icon: Car,
    features: [
      { title: "New & Used Vehicle Financing", desc: "Finance new vehicles and used vehicles up to 10 model years old. Purchase from a dealership or private seller with the same simple application process." },
      { title: "Online Pre-Qualification", desc: "Check your rate without impacting your credit score. Know your budget before you visit the dealership." },
      { title: "Terms from 12 to 72 Months", desc: "Choose a loan term that fits your monthly budget. Shorter terms mean less total interest; longer terms mean lower monthly payments." },
      { title: "Auto Loan Refinancing", desc: "Already have a car loan elsewhere? Refinance with AWS Vision to potentially lower your rate or monthly payment. No application fee." },
      { title: "Preferred Rewards Discount", desc: "Preferred Rewards Gold tier and above receive a 0.25% interest rate discount on new AWS Vision auto loans." },
      { title: "Manage in Online Banking", desc: "View your loan balance, payment due date, and payment history in Online Banking and the mobile app alongside all your other AWS Vision accounts." },
    ],
    products: [
      { name: "New Car Loan", rate: "Competitive fixed rates", desc: "Finance new vehicles with terms up to 72 months.", features: ["Dealer purchase financing", "Pre-qualify online in minutes", "No prepayment penalty", "Preferred Rewards rate discount"] },
      { name: "Used Car Loan", rate: "Competitive fixed rates", desc: "Vehicles up to 10 years old from dealer or private party.", features: ["Private party purchase supported", "Terms up to 60 months", "Same-day approval available", "Gap insurance optional"] },
      { name: "Auto Refinance", rate: "Lower your rate", desc: "Replace your current auto loan with a better AWS Vision rate.", features: ["No application fee", "Apply 100% online", "Keep your current vehicle", "Cash-out refinance available in some cases"] },
    ],
    faqs: [
      { q: "How quickly can I get approved?", a: "Many applications receive a decision within 60 seconds online. Complex applications may require additional review within 1-2 business days." },
      { q: "Do you finance private party purchases?", a: "Yes. AWS Vision finances vehicles purchased from private sellers in addition to dealership purchases." },
      { q: "Is there a prepayment penalty?", a: "No. Pay off your auto loan early without any prepayment penalty." },
    ],
    cta: { label: "Join the Loan Waitlist", href: "/contact#loan-notify" },
  },

  "personal-loans": {
    title: "Personal Loans",
    subtitle: "Borrow for what matters — fixed rates, predictable payments — launching soon",
    hero: "Preview our personal, debt consolidation, and portfolio-backed loan products. Join the waitlist to be notified when lending applications open.",
    icon: Landmark,
    features: [
      { title: "Fixed Rate, Fixed Payment", desc: "Know exactly what you'll pay each month for the life of your loan. No variable rates, no payment surprises." },
      { title: "No Collateral Required", desc: "Personal loans are unsecured — you don't need to put up your home, car, or investments as collateral." },
      { title: "Debt Consolidation", desc: "Combine multiple high-interest debts into one lower monthly payment. Free financial review available with your application." },
      { title: "Portfolio-Backed Loans", desc: "Borrow against your AWS Vision investment portfolio at rates lower than standard personal loans — keep your investments working while accessing cash." },
      { title: "Preferred Rewards Discount", desc: "Preferred Rewards members receive up to 0.25% interest rate discount on eligible new personal loans." },
      { title: "No Prepayment Penalty", desc: "Pay off your loan early anytime without extra fees. Save on interest by making extra principal payments." },
    ],
    products: [
      { name: "AWS Vision Personal Loan", rate: "Fixed APR from 7.99%", desc: "Borrow $5,000 to $100,000 for any personal purpose.", features: ["Terms from 12 to 60 months", "Funds deposited next business day", "Apply online in minutes", "No origination fee for Preferred Rewards members"] },
      { name: "Debt Consolidation Loan", rate: "Fixed APR from 8.49%", desc: "Combine credit cards and other debts into one payment.", features: ["Potentially lower overall interest", "Single monthly payment", "Free debt review consultation", "Direct payment to creditors option"] },
      { name: "Portfolio-Backed Loan", rate: "Fixed APR from 5.99%", desc: "Borrow up to 50% of eligible portfolio value.", features: ["Lower rate than unsecured loans", "Terms up to 120 months", "Investments remain active", "Available to verified investment clients"] },
    ],
    faqs: [
      { q: "How much can I borrow?", a: "Personal loan amounts range from $5,000 to $100,000 depending on creditworthiness, income, and existing AWS Vision relationship." },
      { q: "How fast will I receive funds?", a: "Approved funds are typically deposited to your AWS Vision checking or savings account the next business day." },
      { q: "Will applying affect my credit score?", a: "A hard credit inquiry occurs when you submit a full application. Pre-qualification uses a soft inquiry that does not affect your score." },
    ],
    cta: { label: "Join the Loan Waitlist", href: "/contact#loan-notify" },
  },

  "student-banking": {
    title: "Banking for Students",
    subtitle: "Accounts and tools for students — opening soon",
    hero: "Student banking products are opening soon. Open a Savings, Fixed Deposit, or Investment account today while you wait.",
    icon: GraduationCap,
    features: [
      { title: "SafeBalance® for Students", desc: "No monthly maintenance fee for account owners under age 25. Simple digital checking with no overdraft fees and no paper checks — perfect for campus life." },
      { title: "AWS Vision Student Credit Cards", desc: "Cards designed to help students build credit responsibly. Lower credit limits, financial education resources, and graduation path to standard rewards cards." },
      { title: "Better Money Habits® for Students", desc: "Free articles, videos, and tools on budgeting, saving, credit, and investing — created by AWS Vision financial education experts." },
      { title: "Mobile Banking & AWS Vision Pay", desc: "Send and receive money instantly between U.S. bank accounts. Split rent, pay friends back, and manage campus expenses from your phone." },
      { title: "Student Savings Rate", desc: "Special enhanced savings rate for students under 25 with linked checking accounts — build your emergency fund while in school." },
      { title: "Campus Banking Options", desc: "Financial centers near major university campuses. Schedule appointments with student banking specialists who understand your unique needs." },
    ],
    products: [
      { name: "SafeBalance® Student Checking", rate: "$0/mo under 25", desc: "Ages 16–25. No overdraft fees, digital-first.", features: ["No monthly fee for owners under 25", "Debit card with $0 Liability Guarantee", "Mobile check deposit", "AWS Vision Pay included", "Convert to Advantage Plus at age 25"] },
      { name: "AWS Vision Student Credit Card", rate: "Designed to build credit", desc: "For students with limited credit history.", features: ["Responsible credit building", "Financial education included", "Cash back on purchases", "No annual fee", "Upgrade path to Customized Cash Rewards"] },
      { name: "Student Savings Account", rate: "Enhanced student APY", desc: "Linked to student checking for fee waiver and bonus rate.", features: ["Keep the Change® eligible", "No fee when linked to student checking", "Graduation bonus when converting to standard account", "FDIC insured"] },
    ],
    faqs: [
      { q: "What age can I open a student account?", a: "Students age 16 and older can open a SafeBalance account with a parent or guardian as co-owner. Age 18+ can open independently." },
      { q: "What happens when I turn 25?", a: "Your SafeBalance account converts to a standard Advantage Plus account. You'll receive notice of any fee changes and waiver options 30 days in advance." },
      { q: "Are there student loan options?", a: "AWS Vision offers private student loans for undergraduate and graduate education. Visit awsvision.com/student-loans or speak with an advisor." },
    ],
    cta: { label: "Open a Student Account", href: "/contact#coming-soon" },
  },

  "small-business": {
    title: "Small Business Banking",
    subtitle: "Business banking solutions — opening soon",
    hero: "Small business checking, credit, and lending are opening soon. Savings, FD, and Investment accounts for individuals are available now at awsvision.com/signup.",
    icon: Briefcase,
    features: [
      { title: "Business Advantage Fundamentals™ Banking", desc: "Best for new and smaller businesses with simple banking needs. Business debit card with $0 Liability Guarantee, Zelle® for business, and linked personal/business login." },
      { title: "Business Advantage Relationship™ Banking", desc: "For businesses with robust banking needs. Includes no-fee second Relationship account, no-fee Business Savings, and no-fee incoming wires and stop payments." },
      { title: "Cash Flow Monitor®", desc: "Track credits and debits, get cash flow projections based on scheduled transactions, and connect QuickBooks, ADP, Expensify, and Google Workspace to your dashboard." },
      { title: "Business Advantage 360 Online Banking", desc: "12 months of sortable transactions, 18 months of statements, mobile check deposit, bill pay, wire transfers, and customizable account alerts." },
      { title: "Preferred Rewards for Business", desc: "25% rewards bonus on business credit cards, 5% interest rate booster on Business Savings, and 0.25% rate discount on eligible new business loans." },
      { title: "Dedicated Small Business Specialists", desc: "Access specialists who understand business banking. Schedule appointments online at awsvision.com/appointments." },
    ],
    products: [
      { name: "Business Advantage Fundamentals™", rate: "$16/mo (waivable)", desc: "Minimum deposit $100. Best for new and smaller businesses.", features: ["200 free transactions/month", "Business debit card", "Zelle® for business", "QuickBooks integration", "Cash Flow Monitor®", "First year monthly fee waived for new accounts"] },
      { name: "Business Advantage Relationship™", rate: "$29.95/mo (waivable)", desc: "Minimum deposit $100. For growing businesses.", features: ["500 free transactions/month", "No-fee 2nd Relationship account", "No-fee Business Savings account", "No-fee incoming wires & stop payments", "All Fundamentals features included"] },
      { name: "Business Advantage Line of Credit", rate: "From 9.99% APR", desc: "$10,000 to $500,000 revolving credit.", features: ["Draw funds as needed", "Pay interest only on amount used", "Preferred Rewards 0.25% discount", "Renewable annually", "Use for working capital, inventory, or expansion"] },
    ],
    faqs: [
      { q: "Can I open a business account online?", a: "Yes. Open online, by phone, or in person. Your business does not need to be in a state with a branch to open an AWS Vision business checking account." },
      { q: "How do I avoid the monthly fee?", a: "Fundamentals: maintain qualifying balance or enroll in Preferred Rewards for Business. Relationship: maintain $15,000 combined average daily balance in qualifying business accounts." },
      { q: "What is Remote Deposit Online?", a: "Deposit business checks from your office scanner without visiting a branch. Contact merchant services support for enrollment and setup assistance." },
    ],
    cta: { label: "Open a Business Account", href: "/contact#coming-soon" },
  },

  "wealth-management": {
    title: "AWS Vision Investment Accounts",
    subtitle: "Global sector investing with monthly profit — available now",
    hero: "AWS Vision is an investment firm. We allocate your capital across sectors and regions worldwide — technology, energy, real estate, healthcare, and more — and credit monthly profit directly to your account.",
    icon: LineChart,
    features: [
      { title: "Global Sector Diversification", desc: "Your funds are invested across multiple sectors and geographies — North America, Europe, Asia Pacific, Middle East, and emerging markets — managed by our quantitative investment team." },
      { title: "Monthly Profit Distribution", desc: "Investment profits are calculated and paid to your account every month. View credits in your portal and download professional PDF profit statements." },
      { title: "Real-Time Portfolio Monitoring", desc: "See exactly which sectors, regions, stocks, and funds hold your money. Allocation charts and performance data update in your client portal." },
      { title: "Algorithmic Asset Management", desc: "Our fintech-driven models and AI-guided analytics aim for consistent outcomes across market conditions." },
      { title: "Tiered Investment Programs", desc: "Starter through Platinum tiers based on capital level. Higher tiers unlock enhanced monthly profit rates and dedicated relationship managers." },
      { title: "Deposit & Withdrawal Control", desc: "Place deposit and withdrawal requests from your portal. Track every transaction alongside monthly profit credits." },
    ],
    products: [
      { name: "AWS Vision Managed Portfolio", rate: "Monthly profit", desc: "Fully managed global sector diversification.", features: ["Invested across global sectors", "Monthly profit to your account", "Automatic portfolio rebalancing", "24/7 portal access", "Monthly PDF statements"] },
      { name: "Growth Investment Tier", rate: "Tiered returns", desc: "For capital from $10,000.", features: ["Enhanced sector allocation", "Monthly profit distribution", "Sector and region breakdown", "Priority support"] },
      { name: "Platinum Investment Tier", rate: "Premium returns", desc: "From $250,000. Highest profit tiers.", features: ["Dedicated relationship manager", "Custom sector weighting options", "Monthly and quarterly reporting", "Direct advisor access"] },
    ],
    faqs: [
      { q: "How does AWS Vision invest my money?", a: "We allocate capital across diversified global sectors including technology, energy, real estate, healthcare, and fixed income. Our algorithmic models guide allocation and rebalancing." },
      { q: "When do I receive profit?", a: "Profits are calculated and credited to your investment account monthly. You can download a detailed profit statement from the client portal each month." },
      { q: "Can I see which sectors hold my money?", a: "Yes. The portfolio page shows sector allocation, geographic breakdown, individual holdings, and monthly performance — all in real time." },
    ],
    cta: { label: "Open an Investment Account", href: "/signup" },
  },

  insurance: {
    title: "Insurance Solutions",
    subtitle: "Life, home, auto, health, and investment protection — opening soon",
    hero: "Insurance products are opening soon. Preview coverage options and join the waitlist. Open a Savings, FD, or Investment account today.",
    icon: Heart,
    features: [
      { title: "Term Life Insurance", desc: "Affordable coverage for 10, 20, or 30-year terms. No medical exam required for coverage up to $500,000 for qualified applicants under 50." },
      { title: "Homeowners Insurance", desc: "Protect your home and belongings. Bundle with auto insurance for multi-policy discounts up to 25%." },
      { title: "Auto Insurance", desc: "Liability, collision, comprehensive, and uninsured motorist coverage. Multi-car and safe driver discounts available." },
      { title: "Health & Dental Plans", desc: "Individual and family health plans with telehealth visits, prescription savings, and optional dental and vision add-ons." },
      { title: "Portfolio Protection Insurance", desc: "Optional coverage for AWS Vision investment clients — protects against significant portfolio losses beyond normal market volatility." },
      { title: "Disability Income Insurance", desc: "Replace a portion of your income if illness or injury prevents you from working. Short-term and long-term options." },
    ],
    products: [
      { name: "Term Life Insurance", rate: "From $29/month", desc: "10, 20, or 30-year terms. Up to $2M coverage.", features: ["No medical exam up to $500K", "Convert to whole life option", "Preferred Rewards discount", "Online application"] },
      { name: "Home & Auto Bundle", rate: "Save up to 25%", desc: "Combine homeowners and auto policies.", features: ["Multi-policy discount", "24/7 claims support", "Local agent network", "Mobile claims filing"] },
      { name: "Portfolio Shield", rate: "0.5% of portfolio/year", desc: "Investment downside protection for eligible accounts.", features: ["Automatic enrollment option", "Claims processed within 5 business days", "No deductible on covered events", "Available for portfolios $50,000+"] },
    ],
    faqs: [
      { q: "How do I get an insurance quote?", a: `Get a quote online at awsvision.com/insurance, call ${SITE.phone}, or email ${SITE.email}.` },
      { q: "Can I bundle insurance with my banking?", a: "Yes. AWS Vision clients who bundle home, auto, and life insurance receive additional loyalty discounts through Preferred Rewards." },
      { q: "What is Portfolio Shield?", a: "An optional product for investment clients that provides protection against qualifying significant portfolio declines. Contact your advisor for eligibility." },
    ],
    cta: { label: "Get an Insurance Quote", href: "/contact#coming-soon" },
  },

  "online-banking": {
    title: "Online & Mobile Banking",
    subtitle: "Banking solutions to help you manage your finances whenever and wherever",
    hero: "Enroll in Online Banking to view accounts, pay bills, transfer money, deposit checks, and manage investments — 24 hours a day, 7 days a week. Download the AWS Vision Mobile Banking app for the full experience on iOS and Android.",
    icon: Smartphone,
    features: [
      { title: "Online Banking Dashboard", desc: "Real-time balance information and pending transactions. 12 months of sortable online transactions with check and deposit slip images. 18 months of statements with paperless option." },
      { title: "Mobile Banking App", desc: "Rated 4.8 stars on the App Store. Mobile check deposit, biometric login (Face ID / fingerprint), card lock/unlock, and push notifications for account activity." },
      { title: "Bill Pay & Transfers", desc: "Schedule one-time or recurring electronic payments to companies and individuals. Receive e-bills from participating companies with email notifications when paid." },
      { title: "AWS Vision Pay (Zelle®)", desc: "Send and receive money between eligible U.S. bank accounts using just a mobile number or email address. No additional charges." },
      { title: "Wire Transfers", desc: "Same-day domestic wires or next-day and third-day options for international transfers. You control the speed and cost." },
      { title: "QuickBooks & Account Alerts", desc: "Sync transactions automatically with QuickBooks Online or download to QuickBooks Desktop. Customizable alerts for balances, transactions, and due dates." },
    ],
    products: [
      { name: "Online Banking", rate: "Free with any account", desc: "Full desktop banking experience.", features: ["Account overview dashboard", "Bill Pay and transfers", "eStatements and check images", "Self-service stop payment", "Wire transfer initiation"] },
      { name: "Mobile Banking App", rate: "Free download", desc: "iOS and Android.", features: ["Mobile check deposit", "Biometric login", "Card lock/unlock", "AWS Vision Pay", "Investment portal access", "Appointment scheduling"] },
      { name: "Business Advantage 360", rate: "Free for business accounts", desc: "Small business online banking.", features: ["Cash Flow Monitor®", "QuickBooks sync", "Employee access controls", "Remote deposit online", "Dun & Bradstreet credit scores"] },
    ],
    faqs: [
      { q: "How do I enroll in Online Banking?", a: "Visit awsvision.com and click Enroll in Online Banking. You'll need your account number, Social Security number or Tax ID, and email address." },
      { q: "Is Online Banking secure?", a: "Yes. We use 256-bit SSL encryption, two-factor authentication, and continuous fraud monitoring. Visit our Security Center for tips on protecting your accounts." },
      { q: "How do I deposit a check with my phone?", a: "Open the Mobile Banking app, select Deposit Checks, photograph the front and back of your endorsed check, and submit. Funds typically available next business day." },
    ],
    cta: { label: "Enroll in Online Banking", href: "/signup" },
  },
} as const;

/** CDS page data with current-month promo labels (call at render time) */
export function getCdsServicePage() {
  const promo = getActiveFdPromo();
  return {
    ...SERVICE_PAGES.cds,
    hero: getCdsPromoHero(),
    products: buildFdProducts(promo),
  };
}
