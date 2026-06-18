import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileDataCard } from "@/components/ui/mobile-data-card";
import { RATES_DATA } from "@/lib/site-data";
import { getFdRates } from "@/lib/fd-rates";
import { getActiveFdPromo } from "@/lib/promotions";
import { OPEN_NOW_MESSAGE, COMING_SOON_MESSAGE } from "@/lib/product-availability";
import { RatesJsonLd } from "@/components/seo/rates-json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/rates");

export default function RatesPage() {
  const fdRates = getFdRates();
  const promo = getActiveFdPromo();

  return (
    <div className="overflow-x-hidden">
      <RatesJsonLd />
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-12 text-white sm:py-16">
        <div className="page-container">
          <h1 className="text-3xl font-bold sm:text-4xl">Today&apos;s Rates</h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
            Compare savings and fixed deposit rates available today. Loan, credit card, and checking
            rates are shown for reference — those products are opening soon.
          </p>
          <p className="mt-3 text-sm text-emerald-300">{OPEN_NOW_MESSAGE}</p>
          <Link
            href="/compare"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
          >
            See how we compare to Bank of America, Chase & Wells Fargo →
          </Link>
        </div>
      </section>

      <div className="page-container pt-6 sm:pt-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {COMING_SOON_MESSAGE}
        </div>
      </div>

      <div className="page-container space-y-10 py-8 sm:space-y-12 sm:py-10">
        <RateSection
          title="Checking — Not Offered"
          headers={["Product", "Status", "Alternative"]}
          mobileCards={[
            {
              title: "Checking Accounts",
              fields: [
                { label: "Status", value: "Not offered", highlight: true },
                {
                  label: "Alternative",
                  value: "Savings · Fixed Deposit · Investment",
                },
              ],
            },
          ]}
        >
          <RateRow cells={["Checking Accounts", "Not offered", null]} statusCell />
        </RateSection>

        <RateSection
          title="Savings — Monthly & Yearly Gratuity (Available Now)"
          headers={["Product", "Minimum", "Maximum", "Rate", "APY"]}
          mobileCards={RATES_DATA.savings.map((r) => ({
            title: r.product,
            fields: [
              { label: "Minimum", value: r.min },
              { label: "Maximum", value: r.max },
              { label: "Rate", value: r.rate, highlight: true },
              { label: "APY", value: r.apy, highlight: true },
            ],
          }))}
        >
          {RATES_DATA.savings.map((r) => (
            <RateRow
              key={r.product}
              cells={[r.product, r.min, r.max, r.rate, r.apy]}
              highlight={[3, 4]}
            />
          ))}
        </RateSection>

        <RateSection
          title="Fixed Deposit (FD) Program Rates (Available Now)"
          headers={["Product", "Minimum", "Term", "Monthly Gratuity", "Total Return"]}
          id="fd-rates"
          featuredMonthLabel={promo.monthShort}
          mobileCards={fdRates.map((r) => ({
            title: r.product,
            featured: r.featured,
            fields: [
              { label: "Minimum", value: r.min },
              { label: "Term", value: r.term },
              { label: "Monthly Gratuity", value: r.monthlyRate, highlight: true },
              { label: "Total Return", value: r.totalReturn, highlight: true },
            ],
          }))}
        >
          {fdRates.map((r) => (
            <tr
              key={r.product}
              className={r.featured ? "border-b border-amber-100 bg-amber-50/60" : "border-b border-slate-100"}
            >
              <td className="px-4 py-4 font-medium sm:px-6">
                {r.product}
                {r.featured && (
                  <span className="ml-2 rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                    {promo.monthShort}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-slate-600 sm:px-6">{r.min}</td>
              <td className="px-4 py-4 text-slate-600 sm:px-6">{r.term}</td>
              <td className="px-4 py-4 font-bold text-teal-700 sm:px-6">{r.monthlyRate}</td>
              <td className="px-4 py-4 font-bold text-teal-700 sm:px-6">{r.totalReturn}</td>
            </tr>
          ))}
        </RateSection>

        <p className="-mt-4 text-xs text-slate-500 leading-relaxed sm:-mt-6">
          FD rates mirror AWS Vision investment plan tiers (Silver through Executive). Monthly gratuity
          is credited each month; total return is over the full term at enrollment. {promo.monthLong}{" "}
          Promo requires
          {` ${fdRates[0]?.min ?? "$50,000+"} `}
          minimum and enrollment by {promo.endsLabel.replace("Offer ends ", "")}. Early withdrawal:
          contact your relationship manager to initiate — not available self-service in the portal.
        </p>

        <RateSection
          title="Loan Rates (Opening Soon)"
          headers={["Product", "Interest Rate", "APR", "Type"]}
          mobileCards={RATES_DATA.loans.map((r) => ({
            title: r.product,
            fields: [
              { label: "Interest Rate", value: r.rate, highlight: true },
              { label: "APR", value: r.apr },
              { label: "Type", value: r.type },
            ],
          }))}
        >
          {RATES_DATA.loans.map((r) => (
            <RateRow key={r.product} cells={[r.product, r.rate, r.apr, r.type]} highlight={[1]} />
          ))}
        </RateSection>

        <RateSection
          title="Credit Card Rates (Opening Soon)"
          headers={["Product", "Purchase APR", "Balance Transfer", "Annual Fee"]}
          mobileCards={RATES_DATA.creditCards.map((r) => ({
            title: r.product,
            fields: [
              { label: "Purchase APR", value: r.purchaseAPR, highlight: true },
              { label: "Balance Transfer", value: r.balanceTransfer },
              { label: "Annual Fee", value: r.annualFee },
            ],
          }))}
        >
          {RATES_DATA.creditCards.map((r) => (
            <RateRow
              key={r.product}
              cells={[r.product, r.purchaseAPR, r.balanceTransfer, r.annualFee]}
              highlight={[1]}
            />
          ))}
        </RateSection>

        <div className="rounded-xl bg-teal-50 p-6 text-center sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Open a Savings, FD, or Investment account
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{OPEN_NOW_MESSAGE}</p>
          <Link href="/signup" className="mt-4 inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Open Account
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Rates are subject to change without notice. APY assumes monthly profit reinvestment.
          Loan rates shown are for well-qualified applicants. Actual rates may vary based on
          creditworthiness, loan amount, and term. Credit card APRs vary based on credit profile.
          Investment returns are not guaranteed. See disclosures for full terms.
        </p>
      </div>
    </div>
  );
}

function RateRow({
  cells,
  highlight = [],
  statusCell,
}: {
  cells: (string | null)[];
  highlight?: number[];
  statusCell?: boolean;
}) {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-4 py-4 font-medium sm:px-6">{cells[0]}</td>
      {statusCell ? (
        <>
          <td className="px-4 py-4 font-medium text-amber-700 sm:px-6">{cells[1]}</td>
          <td className="px-4 py-4 text-slate-600 sm:px-6">
            <Link href="/personal/savings" className="text-teal-600 hover:underline">
              Savings
            </Link>
            {" · "}
            <Link href="/personal/cds" className="text-teal-600 hover:underline">
              Fixed Deposit
            </Link>
            {" · "}
            <Link href="/wealth-management" className="text-teal-600 hover:underline">
              Investment
            </Link>
          </td>
        </>
      ) : (
        cells.slice(1).map((cell, i) => (
          <td
            key={i}
            className={`px-4 py-4 sm:px-6 ${highlight.includes(i + 1) ? "font-bold text-teal-700" : "text-slate-600"}`}
          >
            {cell}
          </td>
        ))
      )}
    </tr>
  );
}

type MobileCard = {
  title: string;
  featured?: boolean;
  fields: { label: string; value: string; highlight?: boolean }[];
};

function RateSection({
  title,
  headers,
  mobileCards,
  id,
  featuredMonthLabel,
  children,
}: {
  title: string;
  headers: string[];
  mobileCards?: MobileCard[];
  id?: string;
  featuredMonthLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>

      {mobileCards && (
        <div className="mt-6 space-y-3 md:hidden">
          {mobileCards.map((card) => (
            <MobileDataCard
              key={card.title}
              title={
                <span className="flex flex-wrap items-center gap-2">
                  {card.title}
                  {card.featured && featuredMonthLabel && (
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                      {featuredMonthLabel}
                    </span>
                  )}
                </span>
              }
              fields={card.fields}
              className={card.featured ? "border-amber-200 bg-amber-50/50" : undefined}
            />
          ))}
        </div>
      )}

      <div className="mt-6 hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-950 text-white">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium sm:px-6">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </section>
  );
}
