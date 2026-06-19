"use client";

import { useCallback, useEffect, useState } from "react";
import { PortalHeader } from "@/components/portal/sidebar";
import { InvestmentAgreementsList } from "@/components/portal/investment-agreements-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestmentAgreement } from "@/types";

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<InvestmentAgreement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agreements");
      const data = await res.json();
      if (res.ok) setAgreements(data.agreements ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <PortalHeader
        title="Investment Agreements"
        subtitle="Official enrollment documents, NDA, and deposit confirmations for your programs"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Program Enrollment & Confidentiality Agreements</CardTitle>
            <p className="text-sm text-slate-500">
              When your identity is verified and a deposit is approved, AWS Vision issues a
              professional PDF confirming your program tier, monthly profit rate, tenure, and
              confidentiality obligations. Download and retain for your records.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-slate-500">Loading agreements…</p>
            ) : (
              <InvestmentAgreementsList agreements={agreements} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
