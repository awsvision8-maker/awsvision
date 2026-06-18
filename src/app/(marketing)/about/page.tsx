import Link from "next/link";
import { Globe, Users, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MARYLAND_HEADQUARTERS, SITE } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about");

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-4xl font-bold">About AWS Vision</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300 leading-relaxed">
            AWS Vision is a quantitative fintech-driven investment firm. We offer Savings and
            Fixed Deposit accounts with monthly and yearly gratuity, and invest client capital
            across global sectors with monthly profit distribution.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, value: "$1.8M", label: "Assets Under Management (USD)" },
              { icon: Users, value: "80+", label: "Active Clients" },
              { icon: TrendingUp, value: "4,000+", label: "Financial Centers" },
              { icon: Award, value: "15+", label: "Years Serving Clients" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 p-6 text-center">
                <stat.icon className="mx-auto h-8 w-8 text-teal-600" />
                <p className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">Our Purpose</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              AWS Vision is a quantitative fintech-driven algorithmic asset management firm.
              We provide Savings and Fixed Deposit accounts with structured monthly and yearly
              gratuity, and manage investment portfolios diversified across sectors and regions
              worldwide — with profits credited to clients every month.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              {SITE.licenses}. Our registered office is at {SITE.address.full}, United States.
              Our U.S. headquarters is also located at {MARYLAND_HEADQUARTERS.full}, United States.
              Visit us at{" "}
              <a href={SITE.url} className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">
                awsvision.com
              </a>{" "}
              or contact{" "}
              <a href={`mailto:${SITE.email}`} className="text-teal-600 hover:underline">
                {SITE.email}
              </a>
              .
            </p>
          </div>

          <div id="careers" className="mt-16 rounded-xl bg-slate-50 p-8">
            <h2 className="text-xl font-bold">Careers at AWS Vision</h2>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Join 1,200+ teammates across banking, technology, investments, and client service.
              We offer competitive benefits, professional development, and opportunities to make
              an impact in communities worldwide.
            </p>
            <Link href="/help?q=careers" className="mt-4 inline-block">
              <Button className="mt-0" variant="outline">Search Career Opportunities</Button>
            </Link>
          </div>

          <div id="investors" className="mt-8 rounded-xl bg-slate-50 p-8">
            <h2 className="text-xl font-bold">Investor Relations</h2>
            <p className="mt-2 text-slate-600">
              Quarterly earnings, annual reports, SEC filings, and shareholder resources for
              AWS Vision Financial Corporation.
            </p>
          </div>

          <div id="news" className="mt-8 rounded-xl bg-slate-50 p-8">
            <h2 className="text-xl font-bold">Newsroom</h2>
            <p className="mt-2 text-slate-600">
              Press releases, media contacts, and the latest news from {SITE.name}.
            </p>
          </div>

          <div id="privacy" className="mt-16 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-bold">Privacy & Security</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              AWS Vision is committed to protecting your personal information. We use your data
              to provide services, comply with law, and improve your experience. We do not sell
              personal information. Review our full Privacy Policy and Online Privacy Notice at
              awsvision.com/privacy.
            </p>
          </div>

          <div id="terms" className="mt-8">
            <h2 className="text-lg font-bold">Terms and Conditions</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Use of awsvision.com and AWS Vision products is governed by our Deposit Agreement,
              Online Banking Service Agreement, and applicable product disclosures.
            </p>
          </div>

          <div id="disclosures" className="mt-8">
            <h2 className="text-lg font-bold">Important Disclosures</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Investment products: Not FDIC insured · Not bank guaranteed · May lose value.
              Banking products subject to approval. Credit cards subject to credit approval.
              Rates, fees, and terms subject to change.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
