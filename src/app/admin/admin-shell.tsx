"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

function AdminGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGate>{children}</AdminGate>
    </AdminProvider>
  );
}
