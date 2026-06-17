"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getAccountLabel } from "@/lib/portfolio-engine";
import { usePortfolio } from "@/lib/use-portfolio";
import { formatCurrency } from "@/lib/utils";

export default function WithdrawPage() {
  const portfolio = usePortfolio();
  const [accountId, setAccountId] = useState(portfolio.accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedAccount =
    portfolio.accounts.find((a) => a.id === accountId) ?? portfolio.accounts[0];
  const isFD = selectedAccount?.type === "fixed_deposit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          amount: Number(amount),
          method,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit withdrawal");
        return;
      }
      setReference(data.reference || `WR-${Date.now().toString().slice(-8)}`);
      setSubmitted(true);
    } catch {
      setError("Failed to submit withdrawal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedAccount) {
    return (
      <>
        <PortalHeader title="Withdraw Funds" />
        <div className="p-8 text-center text-slate-500">No accounts available.</div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <PortalHeader title="Withdraw Funds" />
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:p-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          <h2 className="mt-4 text-xl font-bold">Withdrawal Request Placed</h2>
          <p className="mt-2 max-w-md text-slate-500">
            Your withdrawal request for {formatCurrency(Number(amount))} has been submitted.
            Processing typically takes 2–3 business days. A confirmation email has been sent.
          </p>
          <p className="mt-2 text-sm font-mono text-slate-400">
            Reference: {reference}
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              setSubmitted(false);
              setAmount("");
            }}
          >
            New Withdrawal Request
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PortalHeader
        title="Withdraw Funds"
        subtitle="Place a withdrawal request from your account"
      />
      <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
        {isFD && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Fixed Deposit Early Withdrawal</p>
              <p className="mt-1 text-xs text-amber-700">
                This Fixed Deposit matures on {selectedAccount.maturityDate}. To request an early
                withdrawal, please contact your relationship manager first.
              </p>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="From Account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                options={portfolio.accounts.map((a) => ({
                  value: a.id,
                  label: `${getAccountLabel(a)} — ${formatCurrency(a.balance)} available`,
                }))}
              />
              <Input
                label="Withdrawal Amount (USD)"
                type="number"
                min="50"
                max={selectedAccount.balance}
                step="0.01"
                placeholder="5,000.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <Select
                label="Withdrawal Method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                options={[
                  { value: "bank", label: "Bank Transfer (2–3 business days)" },
                  { value: "wire", label: "Wire Transfer (1–2 business days)" },
                ]}
              />
              <div className="rounded-lg bg-slate-50 p-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Balance</span>
                  <span className="font-medium">{formatCurrency(selectedAccount.balance)}</span>
                </div>
                {amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining After Withdrawal</span>
                    <span className="font-medium">
                      {formatCurrency(selectedAccount.balance - Number(amount))}
                    </span>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={
                  !amount ||
                  Number(amount) < 50 ||
                  Number(amount) > selectedAccount.balance
                }
              >
                Submit Withdrawal Request
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
