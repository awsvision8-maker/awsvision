"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { DeveloperCredit } from "@/components/marketing/developer-credit";
import { WealthPromoBanner } from "@/components/marketing/wealth-promo-banner";
import { useAuth } from "@/lib/auth-context";
import { getActiveFdPromo } from "@/lib/promotions";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const promo = getActiveFdPromo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.kycStatus === "verified") {
      router.replace("/portal/dashboard");
    } else if (user) {
      router.replace("/kyc");
    }
  }, [user, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("timeout") === "1") {
      setError("Signed out after 1 minute of inactivity. Please sign in again.");
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        router.push("/kyc");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <WealthPromoBanner variant="strip" />
      <div className="flex flex-1">
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3 text-white">
          <Logo size="lg" href="/" priority />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Grow your wealth with AWS Vision
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            {promo.monthLong} Fixed Deposit clients can earn up to {promo.returnPercent}% returns in{" "}
            {promo.termMonths} months on qualifying deposits. Sign in to track portfolio growth,
            monthly profit, and your path to financial freedom.
          </p>
        </div>
        <p className="text-sm text-slate-500">© awsvision.com</p>
        <DeveloperCredit className="mt-2 text-slate-600" />
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="md" href="/" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your credentials to access the client portal
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-teal-600 hover:text-teal-700">
              Open an account
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-slate-400">
            Demo: client@awsvision.com / demo1234
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
