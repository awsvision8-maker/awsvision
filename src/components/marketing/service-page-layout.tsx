import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COMING_SOON_MESSAGE,
  OPEN_NOW_MESSAGE,
  WAITLIST_HREF,
} from "@/lib/product-availability";
import type { SERVICE_PAGES } from "@/lib/service-pages-content";

type ServiceData = (typeof SERVICE_PAGES)[keyof typeof SERVICE_PAGES];

type PageStatus = "available" | "comingSoon" | "included";

interface ServicePageLayoutProps {
  data: ServiceData;
  status?: PageStatus;
}

export function ServicePageLayout({ data, status = "available" }: ServicePageLayoutProps) {
  const Icon = data.icon;
  const isComingSoon = status === "comingSoon";
  const isIncluded = status === "included";

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            {status === "available" && (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                <CheckCircle2 className="h-4 w-4" />
                Available Now — Open Online
              </div>
            )}
            {isComingSoon && (
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-4 py-1.5 text-sm font-semibold text-teal-300 ring-1 ring-teal-400/30">
                <Sparkles className="h-4 w-4" />
                Opening Soon
              </div>
            )}
            {isIncluded && (
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-4 py-1.5 text-sm font-semibold text-sky-300 ring-1 ring-sky-400/30">
                <CheckCircle2 className="h-4 w-4" />
                Included With Your Account
              </div>
            )}
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-600/20 text-teal-400 ${status !== "available" ? "mt-6" : "mt-6"}`}>
              <Icon className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{data.title}</h1>
            <p className="mt-2 text-lg text-teal-300">{data.subtitle}</p>
            <p className="mt-6 text-slate-300 leading-relaxed">{data.hero}</p>
            {isComingSoon && (
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">{COMING_SOON_MESSAGE}</p>
            )}
            {status === "available" && (
              <p className="mt-4 text-sm text-emerald-200/90 leading-relaxed">{OPEN_NOW_MESSAGE}</p>
            )}
            {isIncluded && (
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Online and mobile banking access is included when you open a Savings, Fixed Deposit, or Investment account.
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              {isComingSoon ? (
                <>
                  <Link href={WAITLIST_HREF}>
                    <Button size="lg">
                      <Bell className="h-4 w-4" />
                      Join the Waitlist
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="border border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Open Savings, FD or Investment
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={data.cta.href}>
                    <Button size="lg">
                      {data.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="border border-slate-600 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      Sign In to Manage
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">Key Features & Benefits</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.features.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <CheckCircle2 className="h-6 w-6 text-teal-600" />
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {data.products && data.products.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="page-container">
            <h2 className="text-2xl font-bold text-slate-900">Products & Options</h2>
            <p className="mt-2 text-slate-600">
              {isComingSoon
                ? "Preview our upcoming lineup — applications open soon"
                : "Compare our offerings and choose what fits your needs"}
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((product) => (
                <div
                  key={product.name}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {isComingSoon && (
                    <span className="mb-2 w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      Opening Soon
                    </span>
                  )}
                  <p className="text-2xl font-bold text-teal-700">{product.rate}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{product.desc}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  {isComingSoon ? (
                    <Link href={WAITLIST_HREF} className="mt-6">
                      <Button className="w-full" variant="outline">
                        Notify Me at Launch
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signup" className="mt-6">
                      <Button className="w-full" variant="outline">
                        Open Account
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.faqs && data.faqs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            {isComingSoon && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                This product is not yet available. You can open a{" "}
                <Link href="/signup" className="font-medium text-teal-700 hover:underline">
                  Savings, FD, or Investment account
                </Link>{" "}
                today while you wait.
              </div>
            )}
            <div className="mt-8 space-y-6">
              {data.faqs.map((faq) => (
                <div key={faq.q} className="border-b border-slate-100 pb-6">
                  <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-teal-700 py-14">
        <div className="page-container text-center">
          {isComingSoon ? (
            <>
              <h2 className="text-2xl font-bold text-white">We&apos;ll notify you when this opens</h2>
              <p className="mt-2 text-teal-100 max-w-xl mx-auto">{COMING_SOON_MESSAGE}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link href={WAITLIST_HREF}>
                  <Button size="lg" className="bg-white text-teal-700 hover:bg-slate-100">
                    <Bell className="h-4 w-4" />
                    Join the Waitlist
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" className="border border-white bg-transparent text-white hover:bg-teal-600 hover:text-white">
                    Open Available Accounts
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
              <p className="mt-2 text-teal-100">{OPEN_NOW_MESSAGE}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link href={data.cta.href}>
                  <Button size="lg" className="bg-white text-teal-700 hover:bg-slate-100">
                    {data.cta.label}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="border border-white bg-transparent text-white hover:bg-teal-600 hover:text-white">
                    Contact an Advisor
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
