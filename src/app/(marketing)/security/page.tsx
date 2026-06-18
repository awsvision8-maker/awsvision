import Link from "next/link";
import { Shield, Lock, Eye, AlertTriangle, Fingerprint, Bell, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/security");

export default function SecurityPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <Shield className="h-12 w-12 text-teal-400" />
          <h1 className="mt-4 text-4xl font-bold">Privacy & Security</h1>
          <p className="mt-4 max-w-3xl text-slate-300 leading-relaxed">
            Your security is our priority. AWS Vision uses industry-leading technology to protect
            your accounts, and we offer tools and resources to help you stay safe online and on mobile.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Lock, title: "$0 Liability Guarantee", desc: "You're not responsible for unauthorized debit or credit card transactions when reported promptly. Report lost or stolen cards immediately." },
            { icon: Fingerprint, title: "Secure Sign-In", desc: "Use biometric login (Face ID, fingerprint) on the mobile app. Two-factor authentication adds an extra layer of protection for Online Banking." },
            { icon: Bell, title: "Account Alerts", desc: "Set up customizable alerts for balances, transactions, bill due dates, and password changes. Receive push notifications on your mobile device." },
            { icon: Eye, title: "24/7 Fraud Monitoring", desc: "Our systems monitor accounts around the clock for suspicious activity. We may contact you to verify unusual transactions." },
            { icon: Shield, title: "Card Controls", desc: "Lock or unlock your debit and credit cards instantly in the Mobile Banking app. Set travel notices for international use." },
            { icon: AlertTriangle, title: "Report Suspicious Activity", desc: "If you receive a suspicious email, text, or call claiming to be AWS Vision, do not respond. Forward to security@awsvision.com and call us directly." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 p-6">
              <item.icon className="h-8 w-8 text-teal-600" />
              <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <section id="identity" className="mt-16 rounded-xl bg-slate-50 p-8">
          <h2 className="text-2xl font-bold text-slate-900">LifeLock™ Identity Theft Protection</h2>
          <p className="mt-2 text-slate-600">Included with AWS Vision Preferred Rewards Platinum Honors tier</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
            <li>• Dark web monitoring for your personal information</li>
            <li>• Credit bureau alerts and annual credit reports</li>
            <li>• Identity restoration specialists if theft occurs</li>
            <li>• Up to $1 million identity theft insurance coverage</li>
          </ul>
        </section>

        <section className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-900">Report Fraud or Unauthorized Activity</h2>
          <p className="mt-2 text-red-800">
            Contact us immediately if you notice unauthorized transactions or suspect your account has been compromised:
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Phone className="h-5 w-5 text-red-700" />
            <div className="flex flex-col gap-1">
              {SITE.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="text-lg font-bold text-red-900 hover:underline">
                  {p.display}
                </a>
              ))}
            </div>
            <a href={`mailto:${SITE.email}`} className="text-sm text-red-700 hover:underline">
              {SITE.email}
            </a>
          </div>
          <p className="mt-1 text-sm text-red-700">Available 24 hours a day, 7 days a week</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/login"><Button variant="danger">Lock My Card in Mobile App</Button></Link>
            <Link href="/contact"><Button variant="outline">Contact Security Team</Button></Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900">Online Banking Security Tips</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Never share your Online ID, passcode, or one-time authorization codes — AWS Vision will never ask for them by phone, email, or text",
              "Only log in at awsvision.com — do not use links from unsolicited emails or texts",
              "Create a strong, unique passcode and change it periodically",
              "Sign up for account alerts and review transactions regularly",
              "Keep your mobile app and browser updated to the latest version",
              "Use secure Wi-Fi for banking — avoid public networks for sensitive transactions",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                <Shield className="h-5 w-5 shrink-0 text-teal-600" />
                {tip}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
