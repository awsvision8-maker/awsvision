"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepositAlertBannerProps {
  title: string;
  message: string;
}

export function DepositAlertBanner({ title, message }: DepositAlertBannerProps) {
  return (
    <div
      role="alert"
      className="relative overflow-hidden rounded-xl border-2 border-red-500 bg-red-50 px-4 py-5 shadow-sm sm:px-6"
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-red-600" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 ring-1 ring-red-200">
            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden />
          </div>
          <div>
            <p className="font-bold text-red-950">{title}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-red-900/90">{message}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Link href="/portal/deposit">
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              Deposit now
            </Button>
          </Link>
          <Link
            href="/portal/notifications"
            className="text-center text-xs font-medium text-red-800 underline hover:text-red-950"
          >
            View full alert
          </Link>
        </div>
      </div>
    </div>
  );
}
