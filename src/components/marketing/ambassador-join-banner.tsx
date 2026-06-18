import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AmbassadorJoinBanner() {
  return (
    <section className="border-y border-violet-200 bg-gradient-to-r from-slate-950 via-violet-950 to-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:flex-row">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
            <Users className="h-6 w-6 text-violet-300" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-300">Join Our Team</p>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl">Become an AWS Vision Brand Ambassador</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 leading-relaxed">
              Earn 3% on every referred client&apos;s initial capital. Elite performers qualify for cash bonuses, luxury timepieces, and more.
            </p>
          </div>
        </div>
        <Link href="/referral-program" className="shrink-0">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-500">
            View Program & Apply
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
