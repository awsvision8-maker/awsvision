import Link from "next/link";
import { Suspense } from "react";
import { HelpCircle, Phone, Mail, MessageCircle, FileText, Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpSearchSection } from "@/components/marketing/help-search";
import { SITE } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/help");

const HELP_TOPICS = [
  { icon: Wallet, title: "Accounts & Deposits", desc: "Open accounts, deposits, withdrawals, and statements", href: "/faq" },
  { icon: FileText, title: "Investment Portal", desc: "Portfolio tracking, profit statements, and KYC", href: "/login" },
  { icon: Shield, title: "Security & Fraud", desc: "Protect your accounts and report suspicious activity", href: "/security" },
  { icon: MessageCircle, title: "Contact Support", desc: "Phone, email, and message form", href: "/contact" },
];

export default function HelpPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <HelpCircle className="h-12 w-12 text-teal-400" />
          <h1 className="mt-4 text-4xl font-bold">Help Center</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            How can we help you? Search below or browse topics.
          </p>
        </div>
        <Suspense fallback={null}>
          <HelpSearchSection />
        </Suspense>
      </section>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HELP_TOPICS.map((topic) => (
            <Link key={topic.title} href={topic.href} className="rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group">
              <topic.icon className="h-8 w-8 text-teal-600" />
              <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-teal-700">{topic.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{topic.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-8">
            <h2 className="text-xl font-bold">Popular Questions</h2>
            <ul className="mt-4 space-y-3">
              {[
                "How do I enroll in Online Banking?",
                "How do I download my monthly profit statement?",
                "What are the investment return tiers?",
                "How do I place a withdrawal request?",
                "How do I report fraud on my account?",
              ].map((q) => (
                <li key={q}>
                  <Link href={`/help?q=${encodeURIComponent(q.replace("?", ""))}`} className="text-sm text-teal-700 hover:underline">{q}</Link>
                </li>
              ))}
            </ul>
            <Link href="/faq" className="mt-6 inline-block">
              <Button variant="outline">View All FAQs</Button>
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold">Contact Support</h2>
            <div className="mt-6 space-y-4">
              {SITE.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="flex items-center gap-3 text-slate-700 hover:text-teal-700">
                  <Phone className="h-5 w-5 text-teal-600" />
                  {p.display}
                </a>
              ))}
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-slate-700 hover:text-teal-700">
                <Mail className="h-5 w-5 text-teal-600" />
                {SITE.email}
              </a>
            </div>
            <Link href="/contact" className="mt-6 inline-block">
              <Button>Send a Message</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
