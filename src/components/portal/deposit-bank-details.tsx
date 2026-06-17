"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { DEPOSIT_BANK_DETAILS } from "@/lib/deposit-instructions";
import { cn } from "@/lib/utils";

interface DepositBankDetailsProps {
  reference?: string;
  className?: string;
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 break-all font-medium text-slate-900">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}

export function DepositBankDetails({ reference, className }: DepositBankDetailsProps) {
  const { accountTitle, accountNumber, routingNumber, bankName } = DEPOSIT_BANK_DETAILS;

  return (
    <div className={cn("rounded-xl border border-teal-200 bg-teal-50/40 p-4 sm:p-5", className)}>
      <p className="text-sm font-semibold text-slate-900">Wire & ACH deposit instructions</p>
      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
        Use these details when sending a domestic wire or ACH transfer from your external bank.
        Include your deposit reference in the memo or description field.
      </p>
      <div className="mt-4 rounded-lg border border-white/80 bg-white px-4">
        <CopyRow label="Account title" value={accountTitle} />
        <CopyRow label="Account number" value={accountNumber} />
        <CopyRow label="Routing number" value={routingNumber} />
        <CopyRow label="Bank name" value={bankName} />
        {reference && <CopyRow label="Your reference (required)" value={reference} />}
      </div>
    </div>
  );
}
