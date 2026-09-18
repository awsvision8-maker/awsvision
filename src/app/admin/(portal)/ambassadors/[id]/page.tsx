"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  Link2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  AdminLoading,
  AdminStatusBadge,
} from "@/components/admin/admin-ui";
import { AdminAmbassadorAssignClients } from "@/components/admin/admin-ambassador-assign-clients";
import { AdminAmbassadorCommissionEditor } from "@/components/admin/admin-ambassador-commission-editor";
import { AdminAmbassadorProfileEditor } from "@/components/admin/admin-ambassador-profile-editor";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ReferralRow {
  id: string;
  name: string;
  email: string;
  kycStatus: string;
  createdAt: string;
  currentCapital?: number;
  currentBalance?: number;
  firstDepositAmount: number;
  firstDepositStatus: string;
  commissionAmount: number;
  commissionEarned: number;
  commissionPending: number;
  commissionStatus: string;
  commissionPayableOn: string | null;
  firstDepositApprovedAt: string | null;
  countsTowardCurrentMonthTarget: boolean;
  pendingCurrentMonthTarget: boolean;
  isActiveInvestor: boolean;
}

interface ProfileData {
  profile: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    referralCode: string;
    referralUrl: string;
    status: string;
    approvedAt: string;
    createdAt: string;
    managerLoginUrl: string;
    commissionRatePercent: number;
  };
  application: {
    id: string;
    city: string | null;
    state: string | null;
    linkedin: string | null;
    experience: string | null;
    message: string;
    status: string;
    reviewNote: string | null;
    reviewedAt: string | null;
    createdAt: string;
  } | null;
  commissionRatePercent: number;
  currentMonth: {
    label: string;
    target: number;
    qualified: number;
    met: boolean;
  } | null;
  monthlyTargets: {
    key: string;
    label: string;
    target: number;
    qualified: number;
    met: boolean;
    isCurrentMonth: boolean;
  }[];
  stats: {
    totalReferrals: number;
    activeClients: number;
    totalFirstDeposits: number;
    totalCommissionEarned: number;
    totalCommissionPending: number;
    totalCommission: number;
  };
  referrals: ReferralRow[];
}

function commissionStatusLabel(status: string, payableOn: string | null) {
  switch (status) {
    case "earned":
      return "Earned (month closed)";
    case "pending_month_end":
      return payableOn
        ? `Payable ${new Date(payableOn).toLocaleDateString()}`
        : "Payable after month end";
    case "awaiting_approval":
      return "Awaiting deposit approval";
    case "awaiting_deposit":
      return "Awaiting first deposit";
    default:
      return status;
  }
}

function depositStatusLabel(status: string) {
  switch (status) {
    case "approved":
      return "First deposit approved";
    case "deposit_pending":
      return "Deposit pending review";
    case "awaiting_deposit":
      return "No deposit yet";
    default:
      return status;
  }
}

export default function AdminAmbassadorProfilePage() {
  const params = useParams();
  const ambassadorId = params.id as string;
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ambassadors/profile/${ambassadorId}`);
      const json = await res.json();
      if (res.ok) setData(json);
      else setData(null);
    } finally {
      setLoading(false);
    }
  }, [ambassadorId]);

  useEffect(() => {
    void load();
  }, [load]);

  const copyLink = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.profile.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <AdminLoading />;

  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Ambassador not found</p>
        <Link href="/admin/ambassadors" className="mt-4 inline-block text-teal-600 hover:underline">
          Back to ambassadors
        </Link>
      </div>
    );
  }

  const { profile, application, stats, referrals, currentMonth, monthlyTargets, commissionRatePercent } =
    data;

  return (
    <div className="p-4 sm:p-8">
      <Link
        href="/admin/ambassadors"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-teal-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to ambassadors
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Complete brand ambassador profile, clients, and commission
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <AdminStatusBadge status={profile.status === "active" ? "approved" : profile.status} />
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
              {profile.referralCode}
            </span>
            <span className="font-mono text-xs text-slate-500">{profile.username}</span>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => void copyLink()}>
          <Copy className="h-4 w-4" />
          {copied ? "Copied" : "Copy referral link"}
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Referred clients",
            value: String(stats.totalReferrals),
            icon: Users,
            hint: `${stats.activeClients} active investors`,
          },
          {
            label: "First deposits",
            value: formatCurrency(stats.totalFirstDeposits),
            icon: TrendingUp,
            hint: "Approved opening deposits",
          },
          {
            label: "Commission earned",
            value: formatCurrency(stats.totalCommissionEarned),
            icon: DollarSign,
            hint: `${commissionRatePercent}% of first deposit`,
          },
          {
            label: "Commission pending",
            value: formatCurrency(stats.totalCommissionPending),
            icon: Clock,
            hint: "Awaiting month close",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <card.icon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">{card.label}</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-sm">
        <p className="font-medium text-violet-900">
          Total commission (earned + pending): {formatCurrency(stats.totalCommission)}
        </p>
        {currentMonth && (
          <p className="mt-1 flex items-center gap-1.5 text-violet-800">
            <Target className="h-3.5 w-3.5" />
            {currentMonth.label}: {currentMonth.qualified}/{currentMonth.target} monthly target
            {currentMonth.met ? " — met" : " — not met yet"}
          </p>
        )}
      </div>

      <AdminAmbassadorCommissionEditor
        ambassadorId={profile.id}
        initialRatePercent={commissionRatePercent}
        onSaved={load}
      />

      <div className="mt-6">
        <AdminAmbassadorProfileEditor
          key={`${profile.email}-${profile.phone}-${profile.username}-${profile.referralCode}-${profile.status}`}
          ambassadorId={profile.id}
          initial={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
            username: profile.username,
            referralCode: profile.referralCode,
            status: profile.status,
          }}
          onSaved={load}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Account summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Email", profile.email],
              ["Phone", profile.phone],
              ["Username", profile.username],
              ["Referral code", profile.referralCode],
              ["Commission rate", `${commissionRatePercent}%`],
              ["Status", profile.status],
              ["Approved", new Date(profile.approvedAt).toLocaleString()],
              ["Account created", new Date(profile.createdAt).toLocaleString()],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-2 border-b border-slate-50 pb-2">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-start gap-2 text-slate-700">
              <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <a
                href={profile.referralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-violet-700 hover:underline"
              >
                {profile.referralUrl}
              </a>
            </p>
            <p className="text-xs text-slate-500">
              Manager portal:{" "}
              <a href={profile.managerLoginUrl} className="text-teal-700 hover:underline">
                {profile.managerLoginUrl}
              </a>
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Application details</h2>
          {application ? (
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-slate-600">
                <strong>Location:</strong>{" "}
                {[application.city, application.state].filter(Boolean).join(", ") || "—"}
              </p>
              {application.linkedin && (
                <p className="text-slate-600">
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={application.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline"
                  >
                    {application.linkedin}
                  </a>
                </p>
              )}
              {application.experience && (
                <p className="text-slate-600">
                  <strong>Experience:</strong> {application.experience}
                </p>
              )}
              <div>
                <p className="font-medium text-slate-700">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-slate-600">{application.message}</p>
              </div>
              {application.reviewNote && (
                <p className="text-slate-600">
                  <strong>Review note:</strong> {application.reviewNote}
                </p>
              )}
              <p className="text-xs text-slate-400">
                Applied {new Date(application.createdAt).toLocaleString()}
                {application.reviewedAt
                  ? ` · Reviewed ${new Date(application.reviewedAt).toLocaleString()}`
                  : ""}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No linked application on file.</p>
          )}
        </section>
      </div>

      {monthlyTargets.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Monthly targets</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {monthlyTargets.map((m) => (
              <div
                key={m.key}
                className={`rounded-lg border p-3 text-sm ${
                  m.isCurrentMonth ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-slate-900">{m.label}</p>
                  {m.met ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Met
                    </span>
                  ) : (
                    <span className="text-xs text-amber-700">
                      {m.qualified}/{m.target}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <AdminAmbassadorAssignClients
        ambassadorId={profile.id}
        ambassadorName={`${profile.firstName} ${profile.lastName}`}
        referralCode={profile.referralCode}
        onAssigned={load}
      />

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Referred clients ({referrals.length})
          </h2>
          <p className="text-xs text-slate-500">
            Commission = {commissionRatePercent}% of each client&apos;s first approved deposit
          </p>
        </div>

        {referrals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No clients linked yet. Use the picker above to assign existing users, or share the
            referral link for new signups.
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{r.name}</h3>
                      <AdminStatusBadge status={r.kycStatus} />
                      {r.isActiveInvestor && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          Active investor
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{r.email}</p>
                    <p className="text-xs text-slate-400">
                      Signed up {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/users/${r.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 hover:bg-teal-200"
                  >
                    Open client <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <p className="text-xs text-slate-500">Current capital</p>
                    <p className="font-medium text-slate-900">
                      {(r.currentCapital ?? 0) > 0
                        ? formatCurrency(r.currentCapital!)
                        : "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(r.currentBalance ?? 0) > 0
                        ? `Balance ${formatCurrency(r.currentBalance!)}`
                        : depositStatusLabel(r.firstDepositStatus)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">First deposit</p>
                    <p className="font-medium text-slate-900">
                      {r.firstDepositAmount > 0 ? formatCurrency(r.firstDepositAmount) : "—"}
                    </p>
                    <p className="text-xs text-slate-500">{depositStatusLabel(r.firstDepositStatus)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Commission</p>
                    <p className="font-medium text-slate-900">
                      {r.commissionAmount > 0 ? formatCurrency(r.commissionAmount) : "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {commissionStatusLabel(r.commissionStatus, r.commissionPayableOn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Earned</p>
                    <p className="font-semibold text-emerald-700">
                      {formatCurrency(r.commissionEarned)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Pending</p>
                    <p className="font-semibold text-amber-700">
                      {formatCurrency(r.commissionPending)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
