"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useAdmin } from "@/lib/admin-context";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Money & Compliance",
    items: [
      { href: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine },
      { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
      { href: "/admin/transactions", label: "Transactions", icon: ClipboardList },
      { href: "/admin/kyc", label: "KYC Review", icon: ShieldCheck },
    ],
  },
  {
    label: "Clients",
    items: [{ href: "/admin/users", label: "Users", icon: Users }],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/messages", label: "Contact", icon: Mail },
      { href: "/admin/appointments", label: "Appointments", icon: Calendar },
      { href: "/admin/waitlist", label: "Waitlist", icon: TrendingUp },
      { href: "/admin/chats", label: "Live Chats", icon: MessageSquare },
      { href: "/admin/ambassadors", label: "Ambassadors", icon: UserPlus },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdmin();

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-800 bg-slate-950 text-slate-200 lg:w-64 lg:border-b-0 lg:border-r lg:min-h-screen">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-teal-400" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400">Admin Portal</p>
            <p className="text-sm font-semibold text-white">{admin?.name}</p>
          </div>
        </div>
        <Logo size="xs" href="/" className="hidden sm:block opacity-80" />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 lg:px-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="mb-1.5 hidden px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 lg:block">
              {section.label}
            </p>
            <div className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-teal-600/20 text-teal-300"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <p className="truncate text-xs text-slate-500">{admin?.email}</p>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
