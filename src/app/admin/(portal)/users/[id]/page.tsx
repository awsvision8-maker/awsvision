"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Pencil, XCircle } from "lucide-react";
import { AdminAccountEditor } from "@/components/admin/admin-account-editor";
import { AdminUserProfileEditor } from "@/components/admin/admin-user-profile-editor";
import { KycDocumentViewer } from "@/components/admin/kyc-document-viewer";
import { AdminInvestmentAgreementsPanel } from "@/components/admin/admin-investment-agreements-panel";
import { AdminDeleteUserPanel } from "@/components/admin/admin-delete-user-panel";
import { AdminProfitAmendmentPanel } from "@/components/admin/admin-profit-amendment-panel";
import {
  AdminActionButton,
  AdminLoading,
  AdminStatusBadge,
} from "@/components/admin/admin-ui";
import type { InvestmentAgreement } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface UserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  onlineId: string | null;
  kycStatus: string;
  profileType: string;
  createdAt: string;
  kycData: Record<string, string> | null;
  pendingKycRequests: { documentKey: string; adminNote?: string | null }[];
  nonprofit: {
    fundCapital: number;
    monthlyRate: number;
    organizationLegalName: string;
  } | null;
  portfolioSummary: {
    totalBalance: number;
    approvedDepositTotal: number;
    monthlyProfit: number;
    nextMonthMonthlyProfit: number;
    profitAccrualActive: boolean;
    profitEligibleAt: string | null;
    nextMonthRatePercent: number;
  };
  accounts: {
    id: string;
    accountNumber: string;
    type: string;
    principal: number;
    monthlyRatePercent: number;
    status: string;
    investmentPlanId: string | null;
    profitEligibleAt: string | null;
    maturityDate: string | null;
    profitRateAmended?: boolean;
    amendmentNote?: string | null;
  }[];
  pendingDeposits: {
    id: string;
    amount: number;
    description: string;
    date: string;
    accountId: string;
  }[];
  transactions: {
    id: string;
    type: string;
    amount: number;
    description: string;
    status: string;
    date: string;
  }[];
  withdrawals: {
    id: string;
    amount: number;
    method: string;
    reference: string;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [agreements, setAgreements] = useState<InvestmentAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    const [userRes, agrRes] = await Promise.all([
      fetch(`/api/admin/users/${userId}`),
      fetch(`/api/admin/users/${userId}/agreements`),
    ]);
    const userData = await userRes.json();
    const agrData = await agrRes.json();
    if (userRes.ok) setUser(userData.user);
    if (agrRes.ok) setAgreements(agrData.agreements ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const kycAction = async (action: "approve" | "reject") => {
    setActing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) await load();
    } finally {
      setActing(false);
    }
  };

  const depositAction = async (depositId: string, action: "approve" | "reject") => {
    setActing(true);
    try {
      const res = await fetch(`/api/admin/deposits/${depositId}/${action}`, { method: "POST" });
      if (res.ok) await load();
    } finally {
      setActing(false);
    }
  };

  if (loading) return <AdminLoading />;
  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">User not found</p>
        <Link href="/admin/users" className="mt-4 inline-block text-teal-600 hover:underline">
          Back to users
        </Link>
      </div>
    );
  }

  const ps = user.portfolioSummary;

  return (
    <div className="p-4 sm:p-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-teal-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-slate-600">{user.email}</p>
          <p className="text-sm text-slate-500">{user.phone}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminStatusBadge status={user.kycStatus} />
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize">
            {user.profileType}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total portfolio", formatCurrency(ps.totalBalance)],
          ["Approved deposits", formatCurrency(ps.approvedDepositTotal)],
          ["Monthly profit (est.)", formatCurrency(ps.monthlyProfit)],
          ["Program rate", `${ps.nextMonthRatePercent}%/mo`],
        ].map(([label, val]) => (
          <div key={label} className="rounded-lg border border-teal-100 bg-teal-50/40 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 font-semibold text-slate-900">{val}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Profit accrual:{" "}
        {ps.profitAccrualActive
          ? "Active"
          : ps.profitEligibleAt
            ? `Scheduled ${formatDate(ps.profitEligibleAt)}`
            : "Not set"}
        · Next month est. {formatCurrency(ps.nextMonthMonthlyProfit)}
      </p>

      <section className="mt-6">
        <AdminProfitAmendmentPanel
          userId={userId}
          accounts={user.accounts}
          monthlyProfitEstimate={ps.monthlyProfit}
          nextMonthRatePercent={ps.nextMonthRatePercent}
          onUpdated={load}
        />
      </section>

      {user.pendingDeposits.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
          <p className="font-semibold text-amber-900">Deposits awaiting your approval</p>
          <p className="mt-1 text-sm text-amber-800">
            Client balance will not update until you approve each deposit below.
          </p>
          <ul className="mt-4 space-y-3">
            {user.pendingDeposits.map((d) => (
              <li
                key={d.id}
                className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{formatCurrency(d.amount)}</p>
                  <p className="text-sm text-slate-600">{d.description}</p>
                  <p className="text-xs text-slate-400">Submitted {formatDate(d.date)}</p>
                </div>
                <div className="flex gap-2">
                  <AdminActionButton
                    variant="approve"
                    disabled={acting}
                    onClick={() => depositAction(d.id, "approve")}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve deposit
                  </AdminActionButton>
                  <AdminActionButton
                    variant="reject"
                    disabled={acting}
                    onClick={() => depositAction(d.id, "reject")}
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </AdminActionButton>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/deposits"
            className="mt-3 inline-block text-sm font-medium text-amber-900 underline"
          >
            View all pending deposits →
          </Link>
        </div>
      )}

      {user.kycStatus !== "verified" && (
        <div className="mt-6 flex flex-wrap gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="w-full text-sm font-medium text-amber-900">KYC pending review</p>
          <AdminActionButton variant="approve" disabled={acting} onClick={() => kycAction("approve")}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
          </AdminActionButton>
          <AdminActionButton variant="reject" disabled={acting} onClick={() => kycAction("reject")}>
            <XCircle className="h-3.5 w-3.5" /> Reject
          </AdminActionButton>
        </div>
      )}

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Pencil className="h-4 w-4 text-teal-600" />
          <h2 className="text-lg font-semibold text-slate-900">Edit user & portfolio</h2>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          Adjust balance, monthly profit rate, investment plan, profit schedule, and profile details.
          Changes apply immediately on the client portal.
        </p>

        <AdminUserProfileEditor
          key={`${user.firstName}-${user.kycStatus}-${user.nonprofit?.fundCapital ?? 0}`}
          userId={userId}
          initial={{
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            kycStatus: user.kycStatus,
          }}
          nonprofit={
            user.nonprofit
              ? {
                  fundCapital: user.nonprofit.fundCapital,
                  monthlyRate: user.nonprofit.monthlyRate,
                }
              : null
          }
          onSaved={load}
        />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Accounts</h2>
        <div className="mt-3 space-y-4">
          {user.accounts.length === 0 ? (
            <p className="text-sm text-slate-500">No accounts</p>
          ) : (
            user.accounts.map((a) => (
              <AdminAccountEditor
                key={`${a.id}-${a.principal}-${a.monthlyRatePercent}-${a.profitEligibleAt}`}
                userId={userId}
                account={a}
                onSaved={load}
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {user.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No transactions
                  </td>
                </tr>
              ) : (
                user.transactions.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50">
                    <td className="px-4 py-2">{formatDate(t.date)}</td>
                    <td className="px-4 py-2 capitalize">{t.type}</td>
                    <td className="px-4 py-2 font-medium">{formatCurrency(t.amount)}</td>
                    <td className="px-4 py-2">
                      <AdminStatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-2 text-slate-600">{t.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Withdrawal requests</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Method</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {user.withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No withdrawals
                  </td>
                </tr>
              ) : (
                user.withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-slate-50">
                    <td className="px-4 py-2">{formatDate(w.createdAt)}</td>
                    <td className="px-4 py-2 font-medium">{formatCurrency(w.amount)}</td>
                    <td className="px-4 py-2">{w.method}</td>
                    <td className="px-4 py-2">
                      <AdminStatusBadge status={w.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {(user.kycData || user.kycStatus !== "verified") && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">KYC documents</h2>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
            <KycDocumentViewer
              kycData={user.kycData ?? {}}
              userId={userId}
              profileType={user.profileType}
              pendingRequests={user.pendingKycRequests}
              onReuploadRequested={load}
            />
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Investment agreements</h2>
        <p className="mt-1 text-sm text-slate-500">
          Issued when a verified client&apos;s deposit is approved. Use <strong>Edit terms</strong>{" "}
          to apply special offers — updates sync to the client account and downloadable PDF.
        </p>
        <div className="mt-3">
          <AdminInvestmentAgreementsPanel
            userId={userId}
            agreements={agreements}
            onUpdated={load}
          />
        </div>
      </section>

      <AdminDeleteUserPanel
        userId={userId}
        email={user.email}
        name={`${user.firstName} ${user.lastName}`}
      />
    </div>
  );
}
