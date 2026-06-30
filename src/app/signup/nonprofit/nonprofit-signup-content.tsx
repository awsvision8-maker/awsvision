"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CheckCircle2, HeartHandshake, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Logo } from "@/components/ui/logo";
import { StepProgress } from "@/components/signup/step-progress";
import { DeveloperCredit } from "@/components/marketing/developer-credit";
import { DocumentUpload } from "@/components/signup/document-upload";
import { OnlineIdField, verifyOnlineIdAvailable } from "@/components/signup/online-id-field";
import { SignupStepErrors } from "@/components/signup/signup-step-errors";
import { useAuth } from "@/lib/auth-context";
import {
  INITIAL_NONPROFIT_SIGNUP,
  NONPROFIT_SIGNUP_STEPS,
  formatEIN,
  validateNonprofitSignupStep,
} from "@/lib/nonprofit-signup-form";
import type { NonprofitSignupApplication } from "@/types";
import { logClientSignupFailure } from "@/lib/signup-client-log";
import { SITE } from "@/lib/site-config";
import {
  NONPROFIT_CAPITAL_TIERS,
  ORGANIZATION_TYPES,
  estimateMonthlyProfit,
  formatNonprofitUsd,
  getNonprofitMonthlyRate,
} from "@/lib/nonprofit-program";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  "VA", "WA", "WV", "WI", "WY", "DC",
].map((s) => ({ value: s, label: s }));

const CAPITAL_OPTIONS = NONPROFIT_CAPITAL_TIERS.map((tier) => ({
  value: String(tier.capital),
  label: `${formatNonprofitUsd(tier.capital)} — ${tier.monthlyRate}% monthly`,
}));

export default function NonprofitSignupContent() {
  const router = useRouter();
  const { signupNonprofit } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NonprofitSignupApplication>(INITIAL_NONPROFIT_SIGNUP);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [onlineIdAvailable, setOnlineIdAvailable] = useState<boolean | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const uploadBusyKeys = useRef(new Set<string>());

  const setUploadBusy = (key: string, busy: boolean) => {
    if (busy) uploadBusyKeys.current.add(key);
    else uploadBusyKeys.current.delete(key);
    setMediaBusy(uploadBusyKeys.current.size > 0);
  };

  const showErrors = (list: string[]) => {
    setErrors(list);
    requestAnimationFrame(() =>
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    );
  };

  const capital = Number(form.expectedFundCapital);
  const monthlyRate = getNonprofitMonthlyRate(capital);
  const monthlyProfit = estimateMonthlyProfit(capital);

  const update = <K extends keyof NonprofitSignupApplication>(
    field: K,
    value: NonprofitSignupApplication[K]
  ) => {
    setErrors([]);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = async () => {
    if (mediaBusy) {
      showErrors(["Please wait — your document is still being processed."]);
      return;
    }
    const stepErrors = validateNonprofitSignupStep(step, form);
    if (stepErrors.length > 0) {
      showErrors(stepErrors);
      return;
    }

    if (step === 3) {
      const idCheck = await verifyOnlineIdAvailable(form.onlineId, {
        orgName: form.organizationLegalName,
      });
      if (!idCheck.ok) {
        showErrors([idCheck.message ?? "This Online ID is already taken. Please choose a different one."]);
        return;
      }
    }

    setErrors([]);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setErrors([]);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (mediaBusy) {
      showErrors(["Please wait — your document is still being processed."]);
      return;
    }
    const stepErrors = validateNonprofitSignupStep(step, form);
    if (stepErrors.length > 0) {
      showErrors(stepErrors);
      void logClientSignupFailure({
        profileType: "nonprofit",
        errorMessage: stepErrors.join("; "),
        errorCode: "client_validation",
        email: form.repEmail,
        onlineId: form.onlineId,
        firstName: form.repFirstName,
        lastName: form.repLastName,
        orgName: form.organizationLegalName,
      });
      return;
    }

    const idCheck = await verifyOnlineIdAvailable(form.onlineId, {
      orgName: form.organizationLegalName,
    });
    if (!idCheck.ok) {
      const msg = idCheck.message ?? "This Online ID is already taken. Please choose a different one.";
      showErrors([msg]);
      void logClientSignupFailure({
        profileType: "nonprofit",
        errorMessage: msg,
        errorCode: "duplicate_online_id",
        email: form.repEmail,
        onlineId: form.onlineId,
        firstName: form.repFirstName,
        lastName: form.repLastName,
        orgName: form.organizationLegalName,
      });
      return;
    }

    setLoading(true);
    setErrors([]);
    try {
      await signupNonprofit(form);
      setSubmitted(true);
      setTimeout(() => router.push("/kyc"), 2500);
    } catch (err) {
      showErrors([
        err instanceof Error ? err.message : "Application submission failed. Please try again.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Application Submitted</h2>
          <p className="mt-2 text-slate-500 leading-relaxed">
            Thank you. Your non-profit organization application for{" "}
            <strong>{form.organizationLegalName}</strong> has been received. We&apos;ll review your
            tax-exempt documentation and notify your authorized representative within 1–2 business
            days.
          </p>
          <p className="mt-4 text-sm text-slate-400">Redirecting to your organization portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-2 px-4 sm:px-6">
          <Logo size="sm" href="/" />
          <div className="hidden text-xs text-slate-500 sm:flex sm:items-center sm:gap-2">
            <Lock className="h-3.5 w-3.5" />
            Secure non-profit enrollment · 256-bit encryption
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            <HeartHandshake className="h-3.5 w-3.5" />
            Non-Profit Organization Enrollment
          </div>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Open a Non-Profit Fund Account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Dedicated enrollment for tax-exempt organizations. Minimum fund capital{" "}
            {formatNonprofitUsd(100_000)} — monthly profit from 8% to 10%.{" "}
            <Link href="/nonprofit" className="text-violet-600 hover:underline">
              View program details
            </Link>
          </p>
        </div>

        <StepProgress currentStep={step} steps={NONPROFIT_SIGNUP_STEPS} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Shield className="h-5 w-5 text-violet-600" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {NONPROFIT_SIGNUP_STEPS[step].label}
              </h2>
              <p className="text-xs text-slate-500">
                Organization verification required under federal AML/KYC rules for non-profit entities.
              </p>
            </div>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <Input
                label="Organization Legal Name *"
                value={form.organizationLegalName}
                onChange={(e) => update("organizationLegalName", e.target.value)}
                placeholder="Community Hope Foundation Inc."
                required
              />
              <Input
                label="DBA / Doing Business As (optional)"
                value={form.dbaName}
                onChange={(e) => update("dbaName", e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Employer Identification Number (EIN) *"
                  value={form.ein}
                  onChange={(e) => update("ein", formatEIN(e.target.value))}
                  placeholder="XX-XXXXXXX"
                  maxLength={10}
                  required
                />
                <Select
                  label="Organization Type *"
                  value={form.organizationType}
                  onChange={(e) => update("organizationType", e.target.value)}
                  options={ORGANIZATION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Year Established *"
                  value={form.yearEstablished}
                  onChange={(e) => update("yearEstablished", e.target.value)}
                  placeholder="1998"
                  maxLength={4}
                  required
                />
                <Input
                  label="Organization Website (optional)"
                  type="url"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://www.example.org"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Mission Statement *
                </label>
                <textarea
                  value={form.missionStatement}
                  onChange={(e) => update("missionStatement", e.target.value)}
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="Briefly describe your organization's mission and how fund returns support your programs."
                />
              </div>
              <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-4">
                <Select
                  label="Expected Fund Capital *"
                  value={form.expectedFundCapital}
                  onChange={(e) => update("expectedFundCapital", e.target.value)}
                  options={CAPITAL_OPTIONS}
                />
                <p className="mt-2 text-sm text-violet-800">
                  Selected rate: <strong>{monthlyRate}% monthly</strong> · Estimated monthly profit:{" "}
                  <strong>{formatNonprofitUsd(monthlyProfit)}</strong>
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Enter the authorized representative who may act on behalf of the organization for
                this account.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First Name *"
                  value={form.repFirstName}
                  onChange={(e) => update("repFirstName", e.target.value)}
                  required
                />
                <Input
                  label="Last Name *"
                  value={form.repLastName}
                  onChange={(e) => update("repLastName", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Title / Position *"
                  value={form.repTitle}
                  onChange={(e) => update("repTitle", e.target.value)}
                  placeholder="Executive Director, Treasurer, etc."
                  required
                />
                <Input
                  label="Organization Email *"
                  type="email"
                  value={form.repEmail}
                  onChange={(e) => update("repEmail", e.target.value)}
                  required
                />
              </div>
              <Input
                label="Organization Phone *"
                type="tel"
                value={form.repPhone}
                onChange={(e) => update("repPhone", e.target.value)}
                placeholder="+1 (469) 754-2201"
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Input
                label="Organization Street Address *"
                value={form.addressLine1}
                onChange={(e) => update("addressLine1", e.target.value)}
                required
              />
              <Input
                label="Suite / Floor (optional)"
                value={form.addressLine2}
                onChange={(e) => update("addressLine2", e.target.value)}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="City *" value={form.city} onChange={(e) => update("city", e.target.value)} required />
                <Select
                  label="State *"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  options={[{ value: "", label: "Select state" }, ...US_STATES]}
                />
                <Input
                  label="ZIP Code *"
                  value={form.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                  maxLength={10}
                  required
                />
              </div>
              <Input label="Country *" value={form.country} onChange={(e) => update("country", e.target.value)} required />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <OnlineIdField
                label="Online ID (for portal sign-in) *"
                value={form.onlineId}
                onChange={(v) => update("onlineId", v)}
                onAvailabilityChange={setOnlineIdAvailable}
                orgName={form.organizationLegalName}
                placeholder="org_communityhope"
              />
              <Input
                label="Passcode *"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
              />
              <Input
                label="Confirm Passcode *"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                required
              />
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                This Online ID and passcode will be used by your authorized representative to access
                the organization dashboard. Individual personal accounts use a separate enrollment at{" "}
                <Link href="/signup" className="text-teal-600 hover:underline">
                  /signup
                </Link>
                .
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <DocumentUpload
                label="IRS Tax-Exempt Determination Letter or 501(c) Status Document"
                fileName={form.taxExemptDocName}
                preview={form.taxExemptDocPreview}
                required
                onError={(msg) => showErrors([msg])}
                onBusyChange={(busy) => setUploadBusy("taxExempt", busy)}
                onChange={(file, preview) => {
                  update("taxExemptDocName", file.name);
                  update("taxExemptDocPreview", preview);
                }}
                onClear={() => {
                  update("taxExemptDocName", "");
                  update("taxExemptDocPreview", "");
                }}
              />
              <DocumentUpload
                label="Board Resolution or Authorization Letter (optional)"
                fileName={form.bylawsOrAuthDocName}
                preview={form.bylawsOrAuthDocPreview}
                onError={(msg) => showErrors([msg])}
                onBusyChange={(busy) => setUploadBusy("bylaws", busy)}
                onChange={(file, preview) => {
                  update("bylawsOrAuthDocName", file.name);
                  update("bylawsOrAuthDocPreview", preview);
                }}
                onClear={() => {
                  update("bylawsOrAuthDocName", "");
                  update("bylawsOrAuthDocPreview", "");
                }}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
                <p>
                  <span className="text-slate-500">Organization:</span>{" "}
                  <strong>{form.organizationLegalName}</strong>
                </p>
                <p>
                  <span className="text-slate-500">EIN:</span> <strong>{form.ein}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Fund capital:</span>{" "}
                  <strong>{formatNonprofitUsd(capital)}</strong> at{" "}
                  <strong>{monthlyRate}% monthly</strong>
                </p>
                <p>
                  <span className="text-slate-500">Representative:</span>{" "}
                  <strong>
                    {form.repFirstName} {form.repLastName}
                  </strong>{" "}
                  ({form.repTitle})
                </p>
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={(e) => update("termsAccepted", e.target.checked)}
                  className="mt-1 rounded border-slate-300"
                />
                <span>
                  I agree to the AWS Vision{" "}
                  <Link href="/about#terms" className="text-violet-600 hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and Non-Profit Fund Program terms.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.eSignConsent}
                  onChange={(e) => update("eSignConsent", e.target.checked)}
                  className="mt-1 rounded border-slate-300"
                />
                <span>
                  I consent to electronic signatures and electronic delivery of account documents.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.patriotActConsent}
                  onChange={(e) => update("patriotActConsent", e.target.checked)}
                  className="mt-1 rounded border-slate-300"
                />
                <span>
                  I certify that I am an authorized representative of this non-profit organization
                  and that the information provided is accurate under the USA PATRIOT Act and applicable
                  AML regulations.
                </span>
              </label>
              <p className="text-xs text-slate-500">
                Questions? Contact {SITE.email} or {SITE.phone}.
              </p>
            </div>
          )}

          <SignupStepErrors errors={errors} errorRef={errorRef} />

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={goBack} disabled={loading}>
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < NONPROFIT_SIGNUP_STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={() => void goNext()}
                className="bg-violet-600 hover:bg-violet-700"
                disabled={mediaBusy || loading || (step === 3 && onlineIdAvailable === false)}
              >
                {mediaBusy ? "Processing document…" : "Continue"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || mediaBusy}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {loading ? "Submitting…" : "Submit Application"}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Opening a personal account instead?{" "}
          <Link href="/signup" className="text-teal-600 hover:underline">
            Individual enrollment
          </Link>
        </p>
        <DeveloperCredit className="mt-4 text-center" />
      </div>
    </div>
  );
}
