"use client";

import { ManagerMarketTicker } from "@/components/manager/manager-market-ticker";

export default function ManagerMarketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Markets</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live U.S. market quotes and headlines for client conversations.
        </p>
      </div>
      <ManagerMarketTicker />
    </div>
  );
}
