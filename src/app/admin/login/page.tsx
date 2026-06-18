"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminProvider, useAdmin } from "@/lib/admin-context";

function AdminLoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) router.push("/admin/dashboard");
    else setError("Invalid admin credentials");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600/20">
            <Shield className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Portal</h1>
            <p className="text-sm text-slate-400">AWS Vision staff sign-in</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            labelClassName="text-slate-300"
            className="border-slate-700 bg-slate-800 text-white"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            labelClassName="text-slate-300"
            className="border-slate-700 bg-slate-800 text-white"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            Sign In to Admin
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Client banking?{" "}
          <Link href="/login" className="text-teal-400 hover:underline">
            Client portal sign-in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AdminProvider>
      <AdminLoginForm />
    </AdminProvider>
  );
}
