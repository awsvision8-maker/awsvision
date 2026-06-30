"use client";

import Link from "next/link";
import { Cake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BirthdayBannerProps {
  firstName: string;
}

export function BirthdayBanner({ firstName }: BirthdayBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-pink-200 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 px-4 py-5 sm:px-6">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-pink-200/40 blur-2xl" />
      <div className="absolute -bottom-6 left-1/3 h-20 w-20 rounded-full bg-amber-200/40 blur-2xl" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-pink-100">
            <Cake className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <p className="font-semibold text-pink-950">Happy Birthday, {firstName}!</p>
            <p className="mt-1 text-sm text-pink-900/80">
              Everyone at AWS Vision wishes you a wonderful day. Thank you for being part of our
              community — we&apos;re celebrating with you today.
            </p>
          </div>
        </div>
        <Link href="/portal/notifications" className="shrink-0">
          <Button size="sm" variant="outline" className="border-pink-200 bg-white/80 hover:bg-white">
            View your birthday message
          </Button>
        </Link>
      </div>
    </div>
  );
}
