"use client";

import { Download, FileCheck, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { generateInvestmentAgreementPDF } from "@/lib/investment-agreement-pdf";
import type { InvestmentAgreement } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface InvestmentAgreementsListProps {
  agreements: InvestmentAgreement[];
  emptyMessage?: string;
}

export function InvestmentAgreementsList({
  agreements,
  emptyMessage = "No investment agreements on file yet. Agreements are issued when your deposit is approved after KYC verification.",
}: InvestmentAgreementsListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = useCallback(async (agreement: InvestmentAgreement) => {
    setDownloadingId(agreement.id);
    try {
      await generateInvestmentAgreementPDF(agreement);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  if (agreements.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {agreements.map((agreement) => (
        <div
          key={agreement.id}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50">
              <FileCheck className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {agreement.planName} Program — {agreement.agreementNumber}
                {agreement.amendedAt && (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800 align-middle">
                    Updated
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Deposit {formatCurrency(agreement.depositAmount)} · Total capital{" "}
                {formatCurrency(agreement.totalPrincipal)} ·{" "}
                <strong className="text-teal-700">{agreement.monthlyRatePercent}%/mo</strong>
              </p>
              {agreement.amendmentNote && (
                <p className="mt-1 text-xs text-amber-800">{agreement.amendmentNote}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>Issued {formatDate(agreement.issuedAt)}</span>
                <span>Maturity {formatDate(agreement.maturityDate)}</span>
                <span>{agreement.termMonths}-month tenure</span>
                <span>Acct ···{agreement.accountNumber.slice(-4)}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="shrink-0"
            disabled={downloadingId === agreement.id}
            onClick={() => void handleDownload(agreement)}
          >
            {downloadingId === agreement.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF
          </Button>
        </div>
      ))}
    </div>
  );
}
