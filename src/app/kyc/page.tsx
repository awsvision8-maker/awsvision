"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

/** Legacy KYC route — redirects to unified signup or portal */
export default function KYCPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/signup");
      return;
    }
    if (user.kycStatus === "verified" || user.kycStatus === "submitted") {
      router.replace("/portal/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <Logo size="md" href="/" />
      <h1 className="mt-6 text-xl font-bold text-slate-900">Identity Verification</h1>
      <p className="mt-2 max-w-md text-slate-500">
        Account opening and KYC verification are now completed in a single application at signup.
      </p>
      <Link href="/signup" className="mt-6">
        <Button>Open an Account</Button>
      </Link>
    </div>
  );
}
