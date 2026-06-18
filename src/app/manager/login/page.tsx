"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ManagerProvider, useManager } from "@/lib/manager-context";

function ManagerLoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useManager();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/manager/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) router.push("/manager/dashboard");
    else setError("Invalid username or password");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20">
            <Users className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Brand Ambassador Portal</h1>
            <p className="text-sm text-slate-400">Manager sign-in — not client or admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            labelClassName="text-slate-300"
            className="border-slate-700 bg-slate-800 text-white"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            labelClassName="text-slate-300"
            className="border-slate-700 bg-slate-800 text-white"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500" loading={loading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Want to join?{" "}
          <Link href="/referral-program" className="text-violet-400 hover:underline">
            Apply to the referral program
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ManagerLoginPage() {
  return (
    <ManagerProvider>
      <ManagerLoginForm />
    </ManagerProvider>
  );
}
