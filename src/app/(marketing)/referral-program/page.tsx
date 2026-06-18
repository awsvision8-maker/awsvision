import Link from "next/link";
import { Award, DollarSign, Target, Users } from "lucide-react";
import { AmbassadorApplicationForm } from "@/components/marketing/ambassador-application-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/referral-program");

const RESPONSIBILITIES = [
  {
    title: "Network Growth",
    desc: "Proactively identify and pitch AWS Vision's premium investment structures to high-net-worth individuals, retail investors, and corporate clients to help our asset bank grow.",
  },
  {
    title: "Consistent Monthly Acquisition",
    desc: "Maintain a minimum baseline of onboarding at least one (1) qualified active investing client each calendar month — first deposit approved and profit withdrawn in the same month.",
  },
  {
    title: "Brand Representation",
    desc: "Act as a trusted, professional face of the firm, maintaining the highest integrity and aligning with our modern financial ethos.",
  },
];

const REWARDS = [
  { tier: "Tier 1 Milestone", reward: "$100,000 Cash Bonus" },
  { tier: "Tier 2 Milestone", reward: "Luxury Timepieces (Expensive Watches)" },
  { tier: "Tier 3 Milestone", reward: "Lamborghini Supercar" },
];

export default function ReferralProgramPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-300">Brand Ambassador Program</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-5xl">AWS Vision Referral Program</h1>
          <p className="mt-6 text-lg text-slate-300 leading-relaxed">
            Join us as a Brand Ambassador. Grow our investor network, earn direct commissions, and compete for elite performance rewards.
          </p>
          <Link
            href="#apply"
            className="mt-8 inline-block rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Apply Now
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-16">
        <section>
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-violet-600" />
            <h2 className="text-2xl font-bold text-slate-900">2. Your Core Responsibilities</h2>
          </div>
          <div className="mt-6 space-y-4">
            {RESPONSIBILITIES.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-teal-200 bg-teal-50 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-teal-700" />
            <h2 className="text-2xl font-bold text-slate-900">3. Commission & Incentive Structure</h2>
          </div>
          <p className="mt-4 text-slate-700 leading-relaxed">
            To ensure your success is highly profitable from day one, AWS Vision offers a direct, powerful incentive structure:
          </p>
          <p className="mt-4 text-slate-800 leading-relaxed">
            <strong>Direct Commission:</strong> For every client you refer who opens and funds an account, you receive a{" "}
            <strong>3% one-time profit share</strong> on their <strong>first approved opening deposit</strong>. Commission
            is credited to your dashboard after the calendar month in which that deposit is approved closes.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Each ambassador receives a unique auto-generated referral code. Clients who sign up without a code are not
            linked to any ambassador.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-slate-900">4. Elite Performance Rewards</h2>
          </div>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We believe in aggressively rewarding exceptional results. Ambassadors who consistently lead our growth tiers and achieve elite performance milestones will qualify for the firm&apos;s luxury incentive bracket:
          </p>
          <ul className="mt-6 space-y-3">
            {REWARDS.map((r) => (
              <li key={r.tier} className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <span className="font-semibold text-amber-900">{r.tier}:</span>
                <span className="text-amber-800">{r.reward}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">How it works after approval</h2>
          </div>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>Submit your application below.</li>
            <li>Our admin team reviews and verifies your profile.</li>
            <li>You receive a unique referral code, dedicated Manager Portal login, and personal signup link.</li>
            <li>Clients register using your code or link — self-registrations without a code are not attributed to you.</li>
            <li>When their first deposit is approved and they withdraw profit in the same month, they count toward your compulsory monthly target.</li>
            <li>Track referrals, deposits, and commission status in your dashboard.</li>
          </ol>
          <p className="mt-4 text-sm text-slate-500">
            Already approved?{" "}
            <Link href="/manager/login" className="font-medium text-violet-700 hover:underline">
              Sign in to the Manager Portal
            </Link>
          </p>
        </section>

        <section id="apply">
          <AmbassadorApplicationForm />
        </section>
      </div>
    </div>
  );
}
