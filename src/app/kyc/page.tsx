"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Clock, ShieldCheck, XCircle } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function KYCPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.kycStatus === "verified") {
      router.replace("/portal/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (user.kycStatus === "verified") return null;

  const isRejected = user.kycStatus === "rejected";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <Logo size="md" href="/" className="mx-auto" />

        {isRejected ? (
          <>
            <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">Verification Not Approved</h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Your identity verification was not approved. Please contact our support team for
              assistance or submit a new application.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
              <Button variant="outline" onClick={() => void logout()}>
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">Verification Pending</h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Thank you for completing your application. Our compliance team is reviewing your
              identity documents. You will receive an email once your account is verified.
            </p>
            <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-left text-sm text-slate-600">
              <p className="flex items-center gap-2 font-medium text-slate-800">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                What happens next
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Admin reviews your ID and selfie from signup</li>
                <li>Typical review time: 1–2 business days</li>
                <li>Portal access unlocks after approval</li>
              </ul>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              Signed in as <strong>{user.email}</strong> · Status:{" "}
              <span className="capitalize">{user.kycStatus}</span>
            </p>
            <Button variant="outline" className="mt-6" onClick={() => void logout()}>
              Sign Out
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
