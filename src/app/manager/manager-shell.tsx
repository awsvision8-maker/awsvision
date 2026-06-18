"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, Users } from "lucide-react";
import Link from "next/link";
import { ManagerProvider, useManager } from "@/lib/manager-context";
import { Logo } from "@/components/ui/logo";

function ManagerGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useManager();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/manager/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

function ManagerNav() {
  const { manager, logout } = useManager();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/manager/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-violet-400" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-400">Brand Ambassador Portal</p>
            <p className="text-sm font-semibold">{manager?.firstName} {manager?.lastName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/referral-program" className="hidden text-xs text-slate-400 hover:text-white sm:block">
            Program Guide
          </Link>
          <Logo size="xs" href="/" className="opacity-70" />
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export function ManagerShell({ children }: { children: React.ReactNode }) {
  return (
    <ManagerProvider>
      <ManagerGate>
        <div className="min-h-screen bg-slate-100">
          <ManagerNav />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </div>
      </ManagerGate>
    </ManagerProvider>
  );
}
