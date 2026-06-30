"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Logo } from "@/components/ui/logo";
import { StepProgress } from "@/components/signup/step-progress";
import { DeveloperCredit } from "@/components/marketing/developer-credit";
import { DocumentUpload } from "@/components/signup/document-upload";
import { SelfieCapture } from "@/components/signup/selfie-capture";
import { OnlineIdField, verifyOnlineIdAvailable } from "@/components/signup/online-id-field";
import { SignupStepErrors } from "@/components/signup/signup-step-errors";
import { InvestmentPlanPicker } from "@/components/signup/investment-plan-picker";
import { WealthPromoBanner } from "@/components/marketing/wealth-promo-banner";
import { useAuth } from "@/lib/auth-context";
import {
  INITIAL_SIGNUP_FORM,
  SIGNUP_STEPS,
  formatSSN,
  maskSSN,
  validateSignupStep,
} from "@/lib/signup-form";
import type { SignupApplication } from "@/types";
import { logClientSignupFailure } from "@/lib/signup-client-log";
import { SITE } from "@/lib/site-config";
import { OPEN_ACCOUNT_TYPES, OPEN_NOW_MESSAGE } from "@/lib/product-availability";
import { getInvestmentPlan, formatUsd } from "@/lib/investment-plans";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  "VA", "WA", "WV", "WI", "WY", "DC",
].map((s) => ({ value: s, label: s }));

export default function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SignupApplication>(INITIAL_SIGNUP_FORM);
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

  useEffect(() => {
    const account = searchParams.get("account");
    const plan = searchParams.get("plan");
    const ref = searchParams.get("ref");
    if (ref) {
      setForm((prev) => ({ ...prev, referralCode: ref.trim().toUpperCase() }));
    }
    if (account === "investment" || plan) {
      setForm((prev) => ({
        ...prev,
        accountType: "investment",
        investmentPlanId: plan && getInvestmentPlan(plan) ? plan : prev.investmentPlanId,
      }));
    } else if (account === "fixed_deposit" || account === "savings") {
      setForm((prev) => ({
        ...prev,
        accountType: account,
        investmentPlanId: "",
      }));
    }
  }, [searchParams]);

  const selectedPlan = getInvestmentPlan(form.investmentPlanId);

  const update = <K extends keyof SignupApplication>(field: K, value: SignupApplication[K]) => {
    setErrors([]);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = async () => {
    if (mediaBusy) {
      showErrors(["Please wait — your photo is still being processed."]);
      return;
    }
    const stepErrors = validateSignupStep(step, form);
    if (stepErrors.length > 0) {
      showErrors(stepErrors);
      return;
    }

    if (step === 3) {
      const idCheck = await verifyOnlineIdAvailable(form.onlineId, {
        firstName: form.firstName,
        lastName: form.lastName,
      });
      if (!idCheck.ok) {
        const msgs = [idCheck.message ?? "This Online ID is already taken. Please choose a different one."];
        showErrors(msgs);
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
      showErrors(["Please wait — your photo is still being processed."]);
      return;
    }
    const stepErrors = validateSignupStep(step, form);
    if (stepErrors.length > 0) {
      showErrors(stepErrors);
      void logClientSignupFailure({
        profileType: "individual",
        errorMessage: stepErrors.join("; "),
        errorCode: "client_validation",
        email: form.email,
        onlineId: form.onlineId,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      return;
    }

    const idCheck = await verifyOnlineIdAvailable(form.onlineId, {
      firstName: form.firstName,
      lastName: form.lastName,
    });
    if (!idCheck.ok) {
      const msg = idCheck.message ?? "This Online ID is already taken. Please choose a different one.";
      showErrors([msg]);
      void logClientSignupFailure({
        profileType: "individual",
        errorMessage: msg,
        errorCode: "duplicate_online_id",
        email: form.email,
        onlineId: form.onlineId,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      return;
    }

    setLoading(true);
    setErrors([]);
    try {
      await signup(form);
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
            Thank you, {form.firstName}. Your account application and identity documents have been
            received. We&apos;ll review your information and notify you within 1–2 business days.
          </p>
          <p className="mt-4 text-sm text-slate-400">Redirecting to verification status…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <WealthPromoBanner variant="strip" />
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-2 px-4 sm:px-6">
          <Logo size="sm" href="/" />
          <div className="hidden text-xs text-slate-500 sm:flex sm:items-center sm:gap-2">
            <Lock className="h-3.5 w-3.5" />
            Secure application · 256-bit encryption
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Open an Account</h1>
          <p className="mt-1 text-sm text-slate-500">
            {OPEN_NOW_MESSAGE} Complete all steps below. Estimated time: 10–15 minutes.
          </p>
        </div>

        <StepProgress currentStep={step} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Shield className="h-5 w-5 text-teal-600" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{SIGNUP_STEPS[step].label}</h2>
              <p className="text-xs text-slate-500">
                All fields marked with * are required for federal identity verification (KYC/AML).
              </p>
            </div>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <Select
                label="Account Type *"
                value={form.accountType}
                onChange={(e) => {
                  const type = e.target.value as SignupApplication["accountType"];
                  update("accountType", type);
                  if (type !== "investment") update("investmentPlanId", "");
                }}
                options={OPEN_ACCOUNT_TYPES.map((t) => ({
                  value: t.value,
                  label: t.label,
                }))}
              />

              {form.accountType === "investment" && (
                <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-4 sm:p-6">
                  <p className="text-sm font-semibold text-slate-900">Select investment plan *</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Choose a tier — monthly profit rates from 2% to 7% per program terms.
                  </p>
                  <div className="mt-4">
                    <InvestmentPlanPicker
                      selectedPlanId={form.investmentPlanId}
                      onSelect={(plan) => update("investmentPlanId", plan.id)}
                    />
                  </div>
                  {selectedPlan && (
                    <p className="mt-3 text-xs text-teal-800 font-medium">
                      Selected: {selectedPlan.name} — {selectedPlan.monthlyRate}% monthly ·{" "}
                      {formatUsd(selectedPlan.minInvestment)} minimum
                    </p>
                  )}
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Legal First Name *" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
                <Input label="Middle Name" value={form.middleName} onChange={(e) => update("middleName", e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Legal Last Name *" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
                <Input label="Suffix (Jr., Sr., III)" value={form.suffix} onChange={(e) => update("suffix", e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Date of Birth *" type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} required />
                <Input
                  label="Social Security Number (SSN) *"
                  value={form.ssn}
                  onChange={(e) => update("ssn", formatSSN(e.target.value))}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Email Address *" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                <Input label="Mobile Phone *" type="tel" placeholder="+1 (469) 754-2201" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Citizenship *"
                  value={form.citizenship}
                  onChange={(e) => update("citizenship", e.target.value)}
                  options={[
                    { value: "US", label: "United States" },
                    { value: "UAE", label: "United Arab Emirates" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <Input label="Country of Birth *" value={form.countryOfBirth} onChange={(e) => update("countryOfBirth", e.target.value)} required />
              </div>
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                Your SSN is required under the USA PATRIOT Act to verify your identity and prevent fraud.
                AWS Vision encrypts and securely stores all personal information.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Input label="Street Address *" value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} placeholder="123 Main Street" required />
              <Input label="Apt, Suite, Unit (optional)" value={form.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="City *" value={form.city} onChange={(e) => update("city", e.target.value)} required />
                <Select label="State *" value={form.state} onChange={(e) => update("state", e.target.value)} options={[{ value: "", label: "Select state" }, ...US_STATES]} />
                <Input label="ZIP Code *" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} maxLength={10} required />
              </div>
              <Input label="Country *" value={form.country} onChange={(e) => update("country", e.target.value)} required />

              <label className="flex items-center gap-2 text-sm text-slate-700 pt-2">
                <input
                  type="checkbox"
                  checked={form.mailingSameAsHome}
                  onChange={(e) => update("mailingSameAsHome", e.target.checked)}
                  className="rounded border-slate-300"
                />
                Mailing address is the same as home address
              </label>

              {!form.mailingSameAsHome && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-700">Mailing Address</p>
                  <Input label="Street Address *" value={form.mailingAddressLine1} onChange={(e) => update("mailingAddressLine1", e.target.value)} />
                  <Input label="Apt, Suite, Unit" value={form.mailingAddressLine2} onChange={(e) => update("mailingAddressLine2", e.target.value)} />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Input label="City *" value={form.mailingCity} onChange={(e) => update("mailingCity", e.target.value)} />
                    <Select label="State *" value={form.mailingState} onChange={(e) => update("mailingState", e.target.value)} options={[{ value: "", label: "Select state" }, ...US_STATES]} />
                    <Input label="ZIP Code *" value={form.mailingPostalCode} onChange={(e) => update("mailingPostalCode", e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Select
                label="Employment Status *"
                value={form.employmentStatus}
                onChange={(e) => update("employmentStatus", e.target.value)}
                options={[
                  { value: "employed", label: "Employed" },
                  { value: "self_employed", label: "Self-Employed" },
                  { value: "retired", label: "Retired" },
                  { value: "student", label: "Student" },
                  { value: "unemployed", label: "Not Currently Employed" },
                ]}
              />
              {(form.employmentStatus === "employed" || form.employmentStatus === "self_employed") && (
                <Input label="Employer / Business Name *" value={form.employer} onChange={(e) => update("employer", e.target.value)} />
              )}
              <Input label="Occupation / Job Title *" value={form.occupation} onChange={(e) => update("occupation", e.target.value)} required />
              <Select
                label="Total Annual Income *"
                value={form.annualIncome}
                onChange={(e) => update("annualIncome", e.target.value)}
                options={[
                  { value: "", label: "Select income range" },
                  { value: "under_25k", label: "Under $25,000" },
                  { value: "25k_50k", label: "$25,000 – $50,000" },
                  { value: "50k_100k", label: "$50,000 – $100,000" },
                  { value: "100k_250k", label: "$100,000 – $250,000" },
                  { value: "250k_plus", label: "$250,000+" },
                ]}
              />
              <Select
                label="Primary Source of Funds *"
                value={form.sourceOfFunds}
                onChange={(e) => update("sourceOfFunds", e.target.value)}
                options={[
                  { value: "employment", label: "Employment Income" },
                  { value: "business", label: "Business Income" },
                  { value: "savings", label: "Personal Savings" },
                  { value: "investment", label: "Investment Returns" },
                  { value: "inheritance", label: "Inheritance / Gift" },
                  { value: "retirement", label: "Retirement / Pension" },
                ]}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <OnlineIdField
                value={form.onlineId}
                onChange={(v) => update("onlineId", v)}
                onAvailabilityChange={setOnlineIdAvailable}
                firstName={form.firstName}
                lastName={form.lastName}
              />
              <Input
                label="Create Passcode *"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Minimum 8 characters"
                required
              />
              <Input
                label="Confirm Passcode *"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                required
              />
              <Input
                label="Brand Ambassador Referral Code (optional)"
                value={form.referralCode ?? ""}
                onChange={(e) => update("referralCode", e.target.value.toUpperCase().replace(/\s/g, ""))}
                placeholder="e.g. AV-ABC123"
              />
              <p className="text-xs text-slate-500">
                Enter your ambassador&apos;s code if you were referred. Leave blank if you are signing up on your own.
              </p>
              <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-600 space-y-1">
                <p className="font-medium text-slate-700">Passcode requirements:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>At least 8 characters</li>
                  <li>Mix of letters and numbers recommended</li>
                  <li>Do not use your SSN or date of birth</li>
                </ul>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <Select
                label="Government-Issued ID Type *"
                value={form.idType}
                onChange={(e) => {
                  update("idType", e.target.value as SignupApplication["idType"]);
                  update("idBackPreview", "");
                  update("idBackName", "");
                }}
                options={[
                  { value: "drivers_license", label: "U.S. Driver's License" },
                  { value: "passport", label: "U.S. Passport" },
                ]}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Document Number *" value={form.idNumber} onChange={(e) => update("idNumber", e.target.value)} required />
                <Input label="Expiration Date *" type="date" value={form.idExpiry} onChange={(e) => update("idExpiry", e.target.value)} required />
              </div>
              {form.idType === "drivers_license" && (
                <Select label="Issuing State *" value={form.idState} onChange={(e) => update("idState", e.target.value)} options={[{ value: "", label: "Select state" }, ...US_STATES]} />
              )}
              <div className="grid gap-6 sm:grid-cols-2">
                <DocumentUpload
                  label={form.idType === "passport" ? "Passport Photo Page *" : "Driver's License — Front *"}
                  fileName={form.idFrontName}
                  preview={form.idFrontPreview}
                  required
                  onError={(msg) => showErrors([msg])}
                  onBusyChange={(busy) => setUploadBusy("idFront", busy)}
                  onChange={(file, preview) => {
                    update("idFrontName", file.name);
                    update("idFrontPreview", preview);
                  }}
                  onClear={() => {
                    update("idFrontName", "");
                    update("idFrontPreview", "");
                  }}
                />
                {form.idType === "drivers_license" ? (
                  <DocumentUpload
                    label="Driver's License — Back *"
                    fileName={form.idBackName}
                    preview={form.idBackPreview}
                    required
                    onError={(msg) => showErrors([msg])}
                    onBusyChange={(busy) => setUploadBusy("idBack", busy)}
                    onChange={(file, preview) => {
                      update("idBackName", file.name);
                      update("idBackPreview", preview);
                    }}
                    onClear={() => {
                      update("idBackName", "");
                      update("idBackPreview", "");
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-sm text-slate-500">
                      U.S. passports only require the photo page upload.
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Ensure all four corners of your document are visible, text is readable, and there is no glare.
              </p>
            </div>
          )}

          {step === 5 && (
            <SelfieCapture
              preview={form.selfiePreview}
              fileName={form.selfieName}
              onError={(msg) => showErrors([msg])}
              onBusyChange={(busy) => setUploadBusy("selfie", busy)}
              onCapture={(file, preview) => {
                update("selfieName", file.name);
                update("selfiePreview", preview);
              }}
              onClear={() => {
                update("selfieName", "");
                update("selfiePreview", "");
              }}
            />
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-slate-50 divide-y divide-slate-200 text-sm">
                {[
                  ["Name", `${form.firstName} ${form.middleName ? form.middleName + " " : ""}${form.lastName}${form.suffix ? ", " + form.suffix : ""}`],
                  ["Date of Birth", form.dateOfBirth],
                  ["SSN", maskSSN(form.ssn)],
                  ["Email", form.email],
                  ["Phone", form.phone],
                  ["Address", `${form.addressLine1}, ${form.city}, ${form.state} ${form.postalCode}`],
                  ["Account Type", form.accountType.replace("_", " ")],
                  ...(form.accountType === "investment" && selectedPlan
                    ? [
                        [
                          "Investment Plan",
                          `${selectedPlan.name} — ${selectedPlan.monthlyRate}%/mo · ${selectedPlan.termMonths} mo`,
                        ],
                        ["Minimum Investment", formatUsd(selectedPlan.minInvestment)],
                      ]
                    : []),
                  ["Online ID", form.onlineId],
                  ...(form.referralCode?.trim()
                    ? [["Referral Code", form.referralCode.trim().toUpperCase()] as const]
                    : []),
                  ["ID Document", `${form.idType.replace("_", " ")} — ${form.idNumber}`],
                  ["Documents", [form.idFrontName, form.idBackName, form.selfieName].filter(Boolean).join(", ") || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between sm:gap-4">
                    <span className="text-slate-500 shrink-0">{label}</span>
                    <span className="font-medium text-slate-900 sm:text-right capitalize break-words">{value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={form.termsAccepted} onChange={(e) => update("termsAccepted", e.target.checked)} className="mt-1 rounded" />
                  <span>
                    I agree to the AWS Vision{" "}
                    <Link href="/about#terms" className="text-teal-600 hover:underline">Terms and Conditions</Link>,{" "}
                    <Link href="/about#privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>, and account disclosures.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={form.eSignConsent} onChange={(e) => update("eSignConsent", e.target.checked)} className="mt-1 rounded" />
                  <span>
                    I consent to receive account documents electronically and agree that my electronic signature
                    is legally binding.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={form.patriotActConsent} onChange={(e) => update("patriotActConsent", e.target.checked)} className="mt-1 rounded" />
                  <span>
                    I certify under penalty of perjury that the information provided is true and correct. I authorize
                    AWS Vision to verify my identity as required by the USA PATRIOT Act and federal banking regulations.
                  </span>
                </label>
              </div>

              <p className="text-xs text-slate-500">
                Questions? Contact us at {SITE.email} or {SITE.phone}.
              </p>
            </div>
          )}

          <SignupStepErrors errors={errors} errorRef={errorRef} />

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between sm:gap-4">
            <Button variant="outline" onClick={goBack} disabled={step === 0 || loading}>
              Back
            </Button>
            {step < SIGNUP_STEPS.length - 1 ? (
              <Button
                onClick={() => void goNext()}
                disabled={mediaBusy || loading || (step === 3 && onlineIdAvailable === false)}
              >
                {mediaBusy ? "Processing photo…" : "Continue"}
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading} disabled={mediaBusy}>
                Submit Application
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">
            Sign in to Online Banking
          </Link>
        </p>
        <DeveloperCredit className="mt-4 text-center" />
      </div>
    </div>
  );
}
