import Link from "next/link";
import { Building2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { pageMetadata, texasServiceFaqJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site-config";
import { TEXAS_CITIES } from "@/lib/texas-cities";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata("/serving-texas");

const btnPrimary =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400";
const btnOutlineLight =
  "inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10";
const btnOutline =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";
const btnTeal =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800";

const OTHER_CITIES = ["El Paso", "Plano", "Irving", "Arlington"];

const SERVICES = [
  {
    title: "Savings accounts",
    href: "/personal/savings",
    copy: "Tiered monthly gratuity with online portal access for Texas households and professionals.",
  },
  {
    title: "Fixed deposits (FD / CD)",
    href: "/personal/cds",
    copy: "Locked program rates and clear maturity terms — open and fund remotely.",
  },
  {
    title: "Wealth management",
    href: "/wealth-management",
    copy: "Silver through Executive investment plans with monthly profit distribution and statements.",
  },
];

export default function ServingTexasPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(texasServiceFaqJsonLd()) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 py-16 text-white sm:py-20">
        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Service area · Texas
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Investment firm Texas — management, wealth &amp; financial services
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Comparing options for the best financial firm in Texas? AWS Vision Financial is an online
            investment company serving Texas clients with investment management, wealth management,
            portfolio tracking, savings, and fixed deposits — Dallas, Houston, Austin, Fort Worth,
            San Antonio, and statewide. Remote KYC, phone support, no retail branch required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={btnPrimary}>
              Open an account
            </Link>
            <Link href="/contact" className={btnOutlineLight}>
              Talk to support
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Statewide coverage",
              text: "Dallas, Houston, Austin, San Antonio, and clients across Texas.",
            },
            {
              icon: ShieldCheck,
              title: "Licensed U.S. firm",
              text: "Licensed financial services with online onboarding and KYC verification.",
            },
            {
              icon: Phone,
              title: "Texas-friendly contact",
              text: `Call ${SITE.phone} or email ${SITE.email} for account help.`,
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-6">
              <item.icon className="h-6 w-6 text-teal-700" />
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Products available to Texas clients</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Same online products we offer nationwide — enroll from anywhere in Texas.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:border-teal-300 hover:bg-teal-50/40"
              >
                <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.copy}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-teal-700">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Cities we commonly serve</h2>
          <p className="mt-2 text-slate-600">
            Service-based coverage — not a list of physical storefronts. Open a city page for local
            details.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {TEXAS_CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/serving-texas/${city.slug}`}
                  className="inline-block rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
                >
                  {city.name}
                </Link>
              </li>
            ))}
            {OTHER_CITIES.map((city) => (
              <li
                key={city}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {city}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-600">
            Read our{" "}
            <Link href="/guides/best-financial-firm-texas" className="font-medium text-teal-700 underline">
              best financial firm in Texas guide
            </Link>
            ,{" "}
            <Link href="/guides/texas-online-wealth-management" className="font-medium text-teal-700 underline">
              Texas wealth management guide
            </Link>{" "}
            or browse all{" "}
            <Link href="/guides" className="font-medium text-teal-700 underline">
              investment guides
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">About our address</h2>
          <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              We do not claim a public Texas retail branch. Our U.S. registered office is in{" "}
              <strong>Lewes, Delaware</strong>, with corporate headquarters in{" "}
              <strong>Germantown, Maryland</strong>. Texas clients are served online and by phone —
              the right model for a digital financial services firm.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900">
                Can Texas residents open an account online?
              </h3>
              <p className="mt-2 text-slate-600">
                Yes. Complete signup and KYC online, then fund your savings, FD, or wealth account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Do I need to visit a branch?</h3>
              <p className="mt-2 text-slate-600">
                No. Onboarding, statements, and portfolio tracking run through the secure client
                portal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">How do I get help?</h3>
              <p className="mt-2 text-slate-600">
                Call {SITE.phone}, email {SITE.email}, or use the{" "}
                <Link href="/contact" className="font-medium text-teal-700 underline">
                  contact page
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/signup" className={btnTeal}>
              Start application
            </Link>
            <Link href="/serving-united-states" className={cn(btnOutline)}>
              Nationwide U.S. coverage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
