import Link from "next/link";
import { ArrowRight, PiggyBank, Vault, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FIRM_SUMMARY,
  GRATUITY_MESSAGE,
  INVESTMENT_MESSAGE,
  WHAT_WE_DO_NOT_OFFER,
  WHAT_WE_OFFER,
} from "@/lib/firm-positioning";

const ICONS = {
  "Savings Accounts": PiggyBank,
  "Fixed Deposit (FD) Accounts": Vault,
  "Investment Accounts": LineChart,
};

export default function CheckingPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-slate-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-3xl font-bold">Checking Accounts Not Offered</h1>
          <p className="mt-4 text-slate-300 leading-relaxed">{WHAT_WE_DO_NOT_OFFER}</p>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">{FIRM_SUMMARY}</p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg">Open Savings, FD, or Investment</Button>
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">What we offer instead</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {WHAT_WE_OFFER.map((item) => {
              const Icon = ICONS[item.title as keyof typeof ICONS];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-xl border border-teal-200 bg-teal-50/30 p-8 hover:shadow-lg transition-all"
                >
                  <Icon className="h-10 w-10 text-teal-600" />
                  <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-teal-700">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="mt-10 text-sm text-slate-500 max-w-2xl">{GRATUITY_MESSAGE}</p>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">{INVESTMENT_MESSAGE}</p>
        </div>
      </section>
    </div>
  );
}
