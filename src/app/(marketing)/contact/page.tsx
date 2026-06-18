import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AppointmentForm,
  ContactMessageForm,
  ProductsWaitlistSection,
  WaitlistForm,
} from "@/components/marketing/contact-forms";
import { OFFICES, SITE, MARYLAND_HEADQUARTERS, formatSitePhones, formatSitePhonesMultiline } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact");

export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-12 sm:py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
            Reach the AWS Vision team for investment inquiries, account support, or
            partnership opportunities. {SITE.licenses}.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-6">
            <ContactCard
              icon={Phone}
              title="Phone"
              desc={`${formatSitePhonesMultiline()}\n${SITE.supportHours}`}
              href={`tel:${SITE.phoneDisplay}`}
            />
            <ContactCard
              icon={Mail}
              title="Email"
              desc={`${SITE.email}\nWe respond within 1 business day`}
              href={`mailto:${SITE.email}`}
            />
            <ContactCard
              icon={MapPin}
              title="U.S. Headquarters"
              desc={`Registered Office\n${SITE.address.full}, United States\n\nHeadquarters\n${MARYLAND_HEADQUARTERS.full}, United States`}
            />
            <ContactCard
              icon={Clock}
              title="Support Hours"
              desc={`${SITE.supportHours}\nInvestment portal support via email anytime`}
            />
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-200 p-5 sm:p-8">
            <h2 className="text-xl font-bold">Send Us a Message</h2>
            <p className="mt-1 text-sm text-slate-500">
              Or email us directly at{" "}
              <a href={`mailto:${SITE.email}`} className="text-teal-600 hover:underline">
                {SITE.email}
              </a>
            </p>
            <ContactMessageForm />
          </div>
        </div>

        <section id="branches" className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900">Our Offices</h2>
          <p className="mt-2 text-slate-600">
            U.S. headquarters in Delaware and Maryland
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {OFFICES.map((office) => (
              <div key={office.name} className="rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-teal-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{office.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{office.address}</p>
                    <a
                      href={`tel:${office.phoneDisplay}`}
                      className="mt-2 block text-sm text-teal-600 hover:underline"
                    >
                      {office.phone}
                    </a>
                    <a
                      href={`mailto:${office.email}`}
                      className="block text-sm text-teal-600 hover:underline"
                    >
                      {office.email}
                    </a>
                    <p className="mt-2 text-xs text-slate-400">{office.hours}</p>
                    <p className="mt-2 text-xs text-slate-500">{office.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-xl bg-slate-950 p-5 sm:p-8 text-white">
          <h2 className="text-xl font-bold">Sign Up for Our Newsletter</h2>
          <p className="mt-2 text-sm text-slate-400">
            Market insights, performance updates, and AWS Vision news. We do not share your
            data with anybody, and only use it for its intended purpose.
          </p>
          <WaitlistForm listType="newsletter" buttonLabel="Subscribe" variant="dark" />
        </section>

        <section id="coming-soon" className="mt-16 rounded-xl border-2 border-amber-200 bg-amber-50 p-5 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Products Opening Soon — Waitlist</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            We currently offer Savings accounts, Fixed Deposit (FD) accounts, and Investment
            accounts only. We do not offer checking accounts. Savings and FD include monthly and
            yearly gratuity; investment accounts receive monthly profit from global sector portfolios.
          </p>
          <ProductsWaitlistSection />        </section>

        <section id="notify" className="mt-16 rounded-xl bg-slate-900 p-5 sm:p-8 text-white">
          <h2 className="text-2xl font-bold">Credit Card Launch Waitlist</h2>
          <p className="mt-2 text-slate-400 max-w-xl">
            AWS Vision credit cards are launching soon. Join the waitlist and we&apos;ll notify you
            when applications open for our Customized Cash, Travel, Premium, Student, and Business cards.
          </p>
          <WaitlistForm listType="credit_cards" buttonLabel="Notify Me at Launch" variant="dark" />
        </section>

        <section id="loan-notify" className="mt-16 rounded-xl bg-teal-900 p-5 sm:p-8 text-white">
          <h2 className="text-2xl font-bold">Loan Facility Launch Waitlist</h2>
          <p className="mt-2 text-teal-100 max-w-xl">
            Home mortgages, auto loans, personal loans, and business lending are launching soon.
            Join the waitlist to be notified when you can apply online.
          </p>
          <WaitlistForm
            listType="loans"
            buttonLabel="Join Loan Waitlist"
            variant="dark"
            buttonClassName="bg-white text-teal-800 hover:bg-teal-50"
          />
        </section>

        <section id="appointment" className="mt-16 rounded-xl bg-teal-700 p-5 sm:p-8 text-white">
          <h2 className="text-2xl font-bold">Schedule an Appointment</h2>
          <p className="mt-2 text-teal-100 max-w-xl">
            Meet with an AWS Vision specialist at your convenience — in person at our Delaware or
            Maryland office, by phone, or video call.
          </p>
          <AppointmentForm />        </section>

        <section id="help" className="mt-16 rounded-xl bg-slate-50 p-8">
          <h2 className="text-xl font-bold">Help Center</h2>
          <p className="mt-2 text-slate-600">Common questions — or call {formatSitePhones(" / ")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { q: "How do I open an investment account?", a: `Click Get Started or email ${SITE.email}. Complete signup, KYC verification, and fund your account online.` },
              { q: "How long do deposits take?", a: "Wire: 1–2 business days. ACH: 3–5 business days. Zelle: typically same day. eCheck: 2–4 business days after image verification. Use the portal Deposit page for wire/ACH details, Zelle address, or eCheck upload." },
              { q: "How do I download my monthly statement?", a: "Sign in to the client portal → Statements → Download PDF." },
              { q: "How do I request a withdrawal?", a: "Log in to the portal → Withdraw → submit your request. Processing typically takes 2–3 business days." },
            ].map((item) => (
              <div key={item.q} className="rounded-lg bg-white p-4 border border-slate-200">
                <h3 className="font-medium text-slate-900">{item.q}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
          <Link href="/login" className="mt-6 inline-block">
            <Button variant="outline">Sign In to Client Portal</Button>
          </Link>
        </section>
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: typeof Phone;
  title: string;
  desc: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-slate-200 p-5 transition-colors hover:border-teal-200 hover:shadow-sm">
      <Icon className="h-6 w-6 text-teal-600" />
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 whitespace-pre-line">{desc}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block cursor-pointer">
        {content}
      </a>
    );
  }

  return content;
}
