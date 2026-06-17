"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  FileImage,
  Landmark,
  Mail,
  Smartphone,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
import { DepositBankDetails } from "@/components/portal/deposit-bank-details";
import { DocumentUpload } from "@/components/signup/document-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import {
  DEPOSIT_METHODS,
  ZELLE_DEPOSIT,
  buildDepositReference,
  type DepositMethodId,
} from "@/lib/deposit-instructions";
import { getAccountLabel } from "@/lib/portfolio-engine";
import { usePortfolio } from "@/lib/use-portfolio";
import { formatCurrency } from "@/lib/utils";

const METHOD_ICONS = {
  wire_ach: Landmark,
  echeck: FileImage,
  zelle: Smartphone,
} as const;

export default function DepositPage() {
  const { user, recordDeposit } = useAuth();
  const portfolio = usePortfolio();
  const [method, setMethod] = useState<DepositMethodId>("wire_ach");
  const [accountId, setAccountId] = useState(portfolio.accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [checkFrontName, setCheckFrontName] = useState("");
  const [checkFrontPreview, setCheckFrontPreview] = useState("");
  const [checkBackName, setCheckBackName] = useState("");
  const [checkBackPreview, setCheckBackPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reference] = useState(() => buildDepositReference(Date.now().toString().slice(-8)));

  const isNonprofit = user?.profileType === "nonprofit" && !!user.nonprofitProfile;

  const accountOptions = useMemo(
    () =>
      portfolio.accounts.map((a) => ({
        value: a.id,
        label: `${getAccountLabel(a)} — ${formatCurrency(a.balance)}`,
      })),
    [portfolio.accounts]
  );

  const selectedAccountId =
    isNonprofit && portfolio.accounts[0] ? portfolio.accounts[0].id : accountId;

  const canSubmit = () => {
    if (!amount || Number(amount) < 100) return false;
    if (method === "echeck") {
      return Boolean(checkFrontPreview && checkBackPreview);
    }
    return true;
  };

  const resetForm = () => {
    setSubmitted(false);
    setAmount("");
    setCheckFrontName("");
    setCheckFrontPreview("");
    setCheckBackName("");
    setCheckBackPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;
    const depositAmount = Number(amount);
    const methodLabel =
      method === "wire_ach"
        ? "Wire / ACH Transfer"
        : method === "zelle"
          ? `Zelle — ${ZELLE_DEPOSIT.email}`
          : "eCheck Deposit";
    const ok = await recordDeposit(
      selectedAccountId,
      depositAmount,
      `${methodLabel} · Ref ${reference}`
    );
    if (ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <PortalHeader title="Deposit Funds" />
        <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">Deposit Request Submitted</h2>
            <p className="mt-2 max-w-md text-slate-500 leading-relaxed">
              Your deposit of {formatCurrency(Number(amount))} has been recorded.
              {method === "wire_ach" &&
                " Complete your wire or ACH transfer using the bank details below and include your reference."}
              {method === "echeck" &&
                " Your check images are being reviewed. Funds will be credited after verification (2–4 business days)."}
              {method === "zelle" &&
                ` Send ${formatCurrency(Number(amount))} via Zelle to ${ZELLE_DEPOSIT.email} and include reference ${reference} in the memo.`}
            </p>
          </div>

          {method === "wire_ach" && <DepositBankDetails reference={reference} />}

          {method === "zelle" && (
            <Card>
              <CardContent className="space-y-3 pt-6 text-sm">
                <div className="flex items-center gap-2 text-teal-700">
                  <Smartphone className="h-5 w-5" />
                  <span className="font-semibold">Zelle payment instructions</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:justify-between sm:gap-3">
                  <span className="text-slate-500">Zelle email</span>
                  <span className="font-medium text-slate-900 break-all">{ZELLE_DEPOSIT.email}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:justify-between sm:gap-3">
                  <span className="text-slate-500">Amount to send</span>
                  <span className="font-bold text-slate-900">{formatCurrency(Number(amount))}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
                  <span className="text-slate-500">Memo / note</span>
                  <span className="font-mono text-sm font-medium break-all">{reference}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {method === "echeck" && (
            <Card>
              <CardContent className="pt-6 text-sm text-slate-600">
                <p>
                  Check images received: <strong>{checkFrontName}</strong> (front) and{" "}
                  <strong>{checkBackName}</strong> (back). You will receive a confirmation email when
                  funds are posted.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <Button onClick={resetForm}>Make Another Deposit</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PortalHeader
        title="Deposit Funds"
        subtitle="Add funds by wire, ACH, eCheck, or Zelle"
      />
      <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Deposit Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {DEPOSIT_METHODS.map((pm) => {
                const Icon = METHOD_ICONS[pm.id];
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setMethod(pm.id)}
                    className={`rounded-lg border p-4 text-left transition-all cursor-pointer ${
                      method === pm.id
                        ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-teal-600" />
                    <p className="mt-2 text-sm font-medium text-slate-900">{pm.label}</p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{pm.desc}</p>
                    <p className="mt-2 text-[10px] text-slate-400">{pm.timing}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {method === "wire_ach" && (
          <DepositBankDetails reference={reference} />
        )}

        {method === "zelle" && (
          <Card className="border-violet-200 bg-violet-50/40">
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center gap-2 text-violet-800">
                <Mail className="h-5 w-5" />
                <p className="font-semibold">Zelle deposit address</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 break-all">{ZELLE_DEPOSIT.email}</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Open Zelle in your banking app, send your deposit amount to this email, and include
                your AWS Vision account reference in the payment note after submitting below.
              </p>
            </CardContent>
          </Card>
        )}

        {method === "echeck" && (
          <Card>
            <CardHeader>
              <CardTitle>eCheck Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-slate-600">
                Upload clear, well-lit photos of both sides of your check. Ensure the MICR line,
                amount, payee, and signature are visible on the front, and the endorsement is visible
                on the back.
              </p>
              <DocumentUpload
                label="Check — Front Side"
                fileName={checkFrontName}
                preview={checkFrontPreview}
                required
                onChange={(file, preview) => {
                  setCheckFrontName(file.name);
                  setCheckFrontPreview(preview);
                }}
                onClear={() => {
                  setCheckFrontName("");
                  setCheckFrontPreview("");
                }}
              />
              <DocumentUpload
                label="Check — Back Side"
                fileName={checkBackName}
                preview={checkBackPreview}
                required
                onChange={(file, preview) => {
                  setCheckBackName(file.name);
                  setCheckBackPreview(preview);
                }}
                onClear={() => {
                  setCheckBackName("");
                  setCheckBackPreview("");
                }}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Deposit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Destination Account"
                value={selectedAccountId}
                onChange={(e) => setAccountId(e.target.value)}
                options={accountOptions}
                disabled={isNonprofit}
              />
              <Input
                label="Amount (USD)"
                type="number"
                min="100"
                step="0.01"
                placeholder="10,000.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              {method === "wire_ach" && (
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  After submitting, send {amount ? formatCurrency(Number(amount)) : "your deposit"}{" "}
                  via wire or ACH to <strong>TEAMBASE TAX & ACCOUNTING SERVICES LLC</strong> using
                  account <strong>2915646531</strong> and routing <strong>044000037</strong>. Reference:{" "}
                  <strong className="font-mono">{reference}</strong>
                </p>
              )}

              {method === "zelle" && (
                <p className="rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-900">
                  Send to <strong>{ZELLE_DEPOSIT.email}</strong> via Zelle after submitting this
                  request. Use reference <strong className="font-mono">{reference}</strong> in the Zelle
                  memo so we can match your payment.
                </p>
              )}

              <Button type="submit" className="w-full" disabled={!canSubmit()}>
                {method === "echeck" ? "Submit eCheck Deposit" : "Submit Deposit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
