"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { DeveloperCredit } from "@/components/marketing/developer-credit";
import { getRecaptchaSiteKey, RecaptchaV2 } from "@/components/security/recaptcha-v2";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("This reset link is missing or invalid. Request a new one.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (getRecaptchaSiteKey() && !recaptchaToken) {
      setError("Please complete the reCAPTCHA checkbox");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword, recaptchaToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || "Could not reset password");
        setRecaptchaToken("");
        setRecaptchaKey((k) => k + 1);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Could not reset password. Please try again.");
      setRecaptchaToken("");
      setRecaptchaKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 lg:hidden">
        <Logo size="md" href="/" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Choose a new password</h1>
      <p className="mt-2 text-sm text-slate-500">
        Enter a new password for your client portal account.
      </p>

      {!token && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          This reset link is invalid.{" "}
          <Link href="/forgot-password" className="font-medium underline">
            Request a new link
          </Link>
          .
        </div>
      )}

      {done ? (
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-900">Password updated</p>
          <p className="mt-2 text-sm text-emerald-800">
            You can now sign in with your new password. Redirecting to sign in…
          </p>
          <Link href="/login" className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline">
            Sign in now
          </Link>
        </div>
      ) : (
        token && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label="New password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <RecaptchaV2 key={recaptchaKey} onChange={setRecaptchaToken} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              Update password
            </Button>
          </form>
        )
      )}

      {!done && (
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">
            Back to sign in
          </Link>
        </p>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Logo size="lg" href="/" priority className="text-white" />
        <div>
          <h2 className="text-3xl font-bold text-white">Secure password update</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            After you save a new password, all existing portal sessions are signed out for your security.
          </p>
        </div>
        <DeveloperCredit className="text-slate-600" />
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
