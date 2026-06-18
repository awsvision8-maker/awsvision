"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  Mail,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { AdminLoading } from "@/components/admin/admin-ui";
import { formatCurrency } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  usersToday: number;
  nonprofitUsers: number;
  pendingKyc: number;
  totalDeposits: number;
  contactMessages: number;
  waitlistEntries: number;
  appointments: number;
  openChats: number;
  totalChats: number;
  pendingWithdrawals: number;
  pendingDeposits: number;
  recentUsers: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileType: string;
    kycStatus: string;
    createdAt: string;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/admin/stats")
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {});
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <AdminLoading />;

  const actionCards = [
    {
      label: "Pending Deposits",
      value: stats.pendingDeposits,
      href: "/admin/deposits",
      icon: ArrowDownToLine,
      color: "text-amber-600",
      highlight: stats.pendingDeposits > 0,
    },
    {
      label: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      href: "/admin/withdrawals",
      icon: ArrowUpFromLine,
      color: "text-red-600",
      highlight: stats.pendingWithdrawals > 0,
    },
    {
      label: "Pending KYC",
      value: stats.pendingKyc,
      href: "/admin/kyc",
      icon: ShieldCheck,
      color: "text-amber-600",
      highlight: stats.pendingKyc > 0,
    },
    {
      label: "Open Live Chats",
      value: stats.openChats,
      href: "/admin/chats",
      icon: MessageSquare,
      color: "text-rose-600",
      highlight: stats.openChats > 0,
    },
  ];

  const infoCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
    { label: "New Today", value: stats.usersToday, icon: UserPlus, color: "text-emerald-600" },
    { label: "Non-Profit Orgs", value: stats.nonprofitUsers, icon: Users, color: "text-violet-600" },
    {
      label: "Approved Deposits",
      value: formatCurrency(stats.totalDeposits),
      href: "/admin/transactions?type=deposit&status=completed",
      icon: Wallet,
      color: "text-teal-600",
    },
    {
      label: "Contact Messages",
      value: stats.contactMessages,
      href: "/admin/messages",
      icon: Mail,
      color: "text-sky-600",
    },
    {
      label: "Waitlist",
      value: stats.waitlistEntries,
      href: "/admin/waitlist",
      icon: TrendingUp,
      color: "text-indigo-600",
    },
    {
      label: "Appointments",
      value: stats.appointments,
      href: "/admin/appointments",
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Operations Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Review queues, manage clients, and monitor platform activity
      </p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Action required
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actionCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md ${
              card.highlight
                ? "border-amber-300 bg-amber-50/50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-2 text-xs font-semibold text-teal-600">Review →</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Overview
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {infoCards.map((card) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
            </>
          );
          return card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {inner}
            </Link>
          ) : (
            <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Recent Registrations</h2>
          <Link href="/admin/users" className="text-sm font-medium text-teal-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">KYC</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <Link href={`/admin/users/${u.id}`} className="font-medium text-teal-700 hover:underline">
                      {u.firstName} {u.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{u.email}</td>
                  <td className="px-6 py-3 capitalize">{u.profileType}</td>
                  <td className="px-6 py-3 capitalize">{u.kycStatus}</td>
                  <td className="px-6 py-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
