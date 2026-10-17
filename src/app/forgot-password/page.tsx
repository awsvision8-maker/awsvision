"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { DeveloperCredit } from "@/components/marketing/developer-credit";
import { getRecaptchaSiteKey, RecaptchaV2 } from "@/components/security/recaptcha-v2";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (getRecaptchaSiteKey() && !recaptchaToken) {
      setError("Please complete the reCAPTCHA checkbox");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, recaptchaToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || "Request failed");
        setRecaptchaToken("");
        setRecaptchaKey((k) => k + 1);
        return;
      }
      setDone(true);
    } catch {
      setError("Could not send reset email. Please try again.");
      setRecaptchaToken("");
      setRecaptchaKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Logo size="lg" href="/" priority className="text-white" />
        <div>
          <h2 className="text-3xl font-bold text-white">Reset your password</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            We will email you a secure link to choose a new password for your client portal.
          </p>
        </div>
        <DeveloperCredit className="text-slate-600" />
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="md" href="/" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Forgot password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter the email or Online ID for your AWS Vision account.
          </p>

          {done ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-medium text-emerald-900">Check your email</p>
              <p className="mt-2 text-sm text-emerald-800 leading-relaxed">
                If an account matches that email or Online ID, we sent password reset instructions.
                The link expires in 1 hour. Also check your spam folder.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                label="Email or Online ID"
                type="text"
                placeholder="you@example.com or your Online ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.replace(/\s/g, ""))}
                autoComplete="username"
                required
              />
              <RecaptchaV2 key={recaptchaKey} onChange={setRecaptchaToken} />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" loading={loading}>
                Send reset link
              </Button>
            </form>
          )}

          {!done && (
            <p className="mt-6 text-center text-sm text-slate-500">
              Remembered it?{" "}
              <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
