"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Shield,
  Wallet,
  X,
  Home,
  Landmark,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/accounts", label: "Accounts", icon: Wallet },
  { href: "/portal/deposit", label: "Deposit", icon: ArrowDownToLine },
  { href: "/portal/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { href: "/portal/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/portal/statements", label: "Statements", icon: FileText },
  { href: "/portal/cards", label: "Cards", icon: CreditCard, soon: true },
  { href: "/portal/loans", label: "Loans", icon: Landmark, soon: true },
  { href: "/portal/insurance", label: "Insurance", icon: Shield, soon: true },
  { href: "/portal/mortgage", label: "Mortgage", icon: Home, soon: true },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-950 text-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-4">
        <Logo size="sm" href="/" className="h-9" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                active
                  ? "bg-teal-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {"soon" in item && item.soon && (
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 rounded-lg bg-slate-900 px-3 py-2">
          {user?.profileType === "nonprofit" && user.nonprofitProfile ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-300">
                Non-Profit Organization
              </p>
              <p className="text-sm font-medium line-clamp-2">
                {user.nonprofitProfile.organizationLegalName}
              </p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </>
          )}
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white lg:hidden cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-64">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}

export function PortalHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 pl-16 pt-16 sm:px-6 lg:px-8 lg:py-5 lg:pl-8 lg:pt-5">
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl break-words">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500 break-words">{subtitle}</p>}
    </header>
  );
}
