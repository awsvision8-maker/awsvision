import type { Metadata } from "next";
import { SITE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Not available in your region",
  robots: { index: false, follow: false },
};

export default function UnavailablePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-center">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-400">
          {SITE.name}
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Not available in your region
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          AWS Vision services are not offered in your country. If you believe this is an
          error, please contact us from a supported location.
        </p>
      </div>
    </main>
  );
}
