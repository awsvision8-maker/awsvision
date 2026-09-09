import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/server/auth-service";
import { SITE } from "@/lib/site-config";

const REFERRAL_PREFIX = "AV";
/** Default commission % when a new ambassador is approved (admin can change per ambassador). */
export const DEFAULT_COMMISSION_RATE_PERCENT = 3;

/** Minimum active clients required per calendar month (brand ambassador program). */
export const MONTHLY_ACTIVE_CLIENT_TARGET = 1;

function randomSegment(length: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function generateAmbassadorUsername(firstName: string, lastName: string) {
  const base = `${firstName}${lastName}`.replace(/[^a-zA-Z]/g, "").toLowerCase().slice(0, 12) || "ambassador";
  return `ba.${base}.${randomSegment(4)}`.toLowerCase();
}

export function generateAmbassadorPassword() {
  return `Av${randomSegment(4)}${randomSegment(4)}!`;
}

async function uniqueReferralCode() {
  for (let i = 0; i < 8; i++) {
    const code = `${REFERRAL_PREFIX}-${randomSegment(6)}`;
    const exists = await prisma.brandAmbassador.findUnique({ where: { referralCode: code } });
    if (!exists) return code;
  }
  return `${REFERRAL_PREFIX}-${randomSegment(8)}`;
}

export function ambassadorReferralUrl(referralCode: string) {
  return `${SITE.url}/signup?ref=${encodeURIComponent(referralCode)}`;
}

export function managerPortalUrl() {
  return `${SITE.url}/manager/login`;
}

function endOfCalendarMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function commissionPayableFrom(firstDepositApprovedAt: Date) {
  return new Date(firstDepositApprovedAt.getFullYear(), firstDepositApprovedAt.getMonth() + 1, 1);
}

function isCommissionPayable(firstDepositApprovedAt: Date) {
  return Date.now() > endOfCalendarMonth(firstDepositApprovedAt).getTime();
}

type DepositTx = { amount: number; date: Date; status: string };

function firstCompletedDeposit(transactions: DepositTx[]) {
  return transactions.find((t) => t.status === "completed");
}

function pendingFirstDeposit(transactions: DepositTx[]) {
  if (firstCompletedDeposit(transactions)) return null;
  return transactions.find((t) => t.status === "pending") ?? null;
}

function referralCommissionFromDeposit(
  firstDepositAmount: number,
  firstDepositApprovedAt: Date,
  commissionRatePercent: number
) {
  const rate = Math.max(0, commissionRatePercent) / 100;
  const commission = firstDepositAmount * rate;
  const payable = isCommissionPayable(firstDepositApprovedAt);
  return {
    firstDepositAmount,
    firstDepositApprovedAt,
    commissionAmount: commission,
    commissionEarned: payable ? commission : 0,
    commissionPending: payable ? 0 : commission,
    commissionStatus: payable ? ("earned" as const) : ("pending_month_end" as const),
    commissionPayableOn: commissionPayableFrom(firstDepositApprovedAt),
  };
}

function isSameCalendarMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

type LedgerTx = { type: string; date: Date; status: string; amount: number };

function hasProfitWithdrawalInMonth(transactions: LedgerTx[], monthAnchor: Date) {
  return transactions.some(
    (t) =>
      (t.type === "withdrawal" || t.type === "profit") &&
      t.status === "completed" &&
      isSameCalendarMonth(t.date, monthAnchor)
  );
}

/** Client counts toward monthly target when first deposit and profit withdrawal both occur in the same month. */
export function clientQualifiesForMonthlyTarget(
  firstDepositApprovedAt: Date | null,
  transactions: LedgerTx[],
  monthAnchor: Date
) {
  if (!firstDepositApprovedAt) return false;
  if (!isSameCalendarMonth(firstDepositApprovedAt, monthAnchor)) return false;
  return hasProfitWithdrawalInMonth(transactions, monthAnchor);
}

function buildMonthlyTargets(
  referrals: {
    id: string;
    name: string;
    email: string;
    firstDepositApprovedAt: Date | null;
    transactions: LedgerTx[];
  }[],
  ambassadorApprovedAt: Date,
  monthsBack = 6
) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);
  const firstMonth = new Date(
    Math.max(start.getTime(), new Date(ambassadorApprovedAt.getFullYear(), ambassadorApprovedAt.getMonth(), 1).getTime())
  );

  const months: Date[] = [];
  let cursor = new Date(firstMonth.getFullYear(), firstMonth.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  while (cursor <= end) {
    months.push(new Date(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return months.map((monthAnchor) => {
    const qualifiedClients = referrals
      .filter((r) => clientQualifiesForMonthlyTarget(r.firstDepositApprovedAt, r.transactions, monthAnchor))
      .map((r) => {
        const withdrawal = r.transactions.find(
          (t) =>
            (t.type === "withdrawal" || t.type === "profit") &&
            t.status === "completed" &&
            isSameCalendarMonth(t.date, monthAnchor)
        );
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          firstDepositApprovedAt: r.firstDepositApprovedAt!,
          profitWithdrawnAt: withdrawal?.date ?? null,
          profitWithdrawnAmount: withdrawal?.amount ?? 0,
        };
      });

    const pendingClients = referrals
      .filter((r) => {
        if (!r.firstDepositApprovedAt) return false;
        if (!isSameCalendarMonth(r.firstDepositApprovedAt, monthAnchor)) return false;
        return !hasProfitWithdrawalInMonth(r.transactions, monthAnchor);
      })
      .map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        firstDepositApprovedAt: r.firstDepositApprovedAt!,
        reason: "Awaiting client profit withdrawal this month",
      }));

    const qualified = qualifiedClients.length;
    return {
      key: monthKey(monthAnchor),
      label: monthLabel(monthAnchor),
      year: monthAnchor.getFullYear(),
      month: monthAnchor.getMonth() + 1,
      isCurrentMonth: isSameCalendarMonth(monthAnchor, now),
      target: MONTHLY_ACTIVE_CLIENT_TARGET,
      qualified,
      met: qualified >= MONTHLY_ACTIVE_CLIENT_TARGET,
      qualifiedClients,
      pendingClients,
    };
  });
}

export async function saveAmbassadorApplication(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  linkedin?: string;
  experience?: string;
  message: string;
}) {
  const email = data.email.toLowerCase().trim();
  const pending = await prisma.brandAmbassadorApplication.findFirst({
    where: { email, status: "pending" },
  });
  if (pending) {
    throw new Error("You already have a pending application. Our team will contact you soon.");
  }

  const existingAmbassador = await prisma.brandAmbassador.findUnique({ where: { email } });
  if (existingAmbassador) {
    throw new Error("An ambassador account already exists for this email.");
  }

  return prisma.brandAmbassadorApplication.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email,
      phone: data.phone.trim(),
      city: data.city?.trim(),
      state: data.state?.trim(),
      linkedin: data.linkedin?.trim(),
      experience: data.experience?.trim(),
      message: data.message.trim(),
    },
  });
}

export async function listAmbassadorApplications(status?: string) {
  return prisma.brandAmbassadorApplication.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      ambassador: {
        select: {
          id: true,
          username: true,
          referralCode: true,
          status: true,
          approvedAt: true,
          commissionRatePercent: true,
          _count: { select: { referrals: true } },
        },
      },
    },
  });
}

export async function approveAmbassadorApplication(applicationId: string, reviewNote?: string) {
  const application = await prisma.brandAmbassadorApplication.findUnique({
    where: { id: applicationId },
    include: { ambassador: true },
  });
  if (!application) throw new Error("Application not found");
  if (application.status !== "pending") throw new Error("Application already reviewed");
  if (application.ambassador) throw new Error("Ambassador account already exists");

  const plainPassword = generateAmbassadorPassword();
  const username = generateAmbassadorUsername(application.firstName, application.lastName);
  const referralCode = await uniqueReferralCode();

  const ambassador = await prisma.$transaction(async (tx) => {
    const created = await tx.brandAmbassador.create({
      data: {
        applicationId: application.id,
        username,
        email: application.email,
        passwordHash: await hashPassword(plainPassword),
        firstName: application.firstName,
        lastName: application.lastName,
        phone: application.phone,
        referralCode: referralCode.toUpperCase(),
      },
    });

    await tx.brandAmbassadorApplication.update({
      where: { id: application.id },
      data: {
        status: "approved",
        reviewedAt: new Date(),
        reviewNote: reviewNote?.trim() || null,
      },
    });

    return created;
  });

  return { ambassador, plainPassword, username };
}

export async function rejectAmbassadorApplication(applicationId: string, reviewNote?: string) {
  const application = await prisma.brandAmbassadorApplication.findUnique({ where: { id: applicationId } });
  if (!application) throw new Error("Application not found");
  if (application.status !== "pending") throw new Error("Application already reviewed");

  return prisma.brandAmbassadorApplication.update({
    where: { id: applicationId },
    data: {
      status: "rejected",
      reviewedAt: new Date(),
      reviewNote: reviewNote?.trim() || null,
    },
  });
}

export async function authenticateManager(username: string, password: string) {
  const ambassador = await prisma.brandAmbassador.findUnique({
    where: { username: username.trim().toLowerCase() },
  });
  if (!ambassador || ambassador.status !== "active") return null;
  const ok = await verifyPassword(password, ambassador.passwordHash);
  if (!ok) return null;
  return ambassador;
}

export async function getAmbassadorByReferralCode(code: string) {
  return prisma.brandAmbassador.findFirst({
    where: { referralCode: code.trim().toUpperCase(), status: "active" },
  });
}

/** Active ambassadors for admin referral assignment dropdowns */
export async function listActiveAmbassadors() {
  return prisma.brandAmbassador.findMany({
    where: { status: "active" },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      referralCode: true,
      username: true,
      _count: { select: { referrals: true } },
    },
  });
}

export async function getAmbassadorDashboard(ambassadorId: string) {
  const ambassador = await prisma.brandAmbassador.findUnique({
    where: { id: ambassadorId },
    include: {
      referrals: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          kycStatus: true,
          createdAt: true,
          transactions: {
            orderBy: { date: "asc" },
            select: { type: true, amount: true, date: true, status: true },
          },
        },
      },
    },
  });
  if (!ambassador) return null;

  const referralLedgers = ambassador.referrals.map((user) => {
    const deposits = user.transactions.filter((t) => t.type === "deposit");
    const approved = firstCompletedDeposit(deposits);
    return {
      user,
      deposits,
      approved,
      ledger: user.transactions.map((t) => ({
        type: t.type,
        amount: t.amount,
        date: t.date,
        status: t.status,
      })),
    };
  });

  const referrals = referralLedgers.map(({ user, deposits, approved, ledger }) => {

    const pending = pendingFirstDeposit(deposits);
    const firstDepositApprovedAt = approved?.date ?? null;
    const now = new Date();
    const countsTowardCurrentMonthTarget = clientQualifiesForMonthlyTarget(
      firstDepositApprovedAt,
      ledger,
      now
    );
    const pendingCurrentMonthTarget =
      !!firstDepositApprovedAt &&
      isSameCalendarMonth(firstDepositApprovedAt, now) &&
      !hasProfitWithdrawalInMonth(ledger, now);

    const base = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      kycStatus: user.kycStatus,
      createdAt: user.createdAt,
      firstDepositAmount: 0,
      firstDepositStatus: "awaiting_deposit" as const,
      commissionAmount: 0,
      commissionEarned: 0,
      commissionPending: 0,
      commissionStatus: "awaiting_deposit" as const,
      commissionPayableOn: null as Date | null,
      firstDepositApprovedAt: null as Date | null,
      countsTowardCurrentMonthTarget,
      pendingCurrentMonthTarget,
    };

    if (approved) {
      const commission = referralCommissionFromDeposit(
        approved.amount,
        approved.date,
        ambassador.commissionRatePercent
      );
      return {
        ...base,
        firstDepositAmount: commission.firstDepositAmount,
        firstDepositStatus: "approved" as const,
        commissionAmount: commission.commissionAmount,
        commissionEarned: commission.commissionEarned,
        commissionPending: commission.commissionPending,
        commissionStatus: commission.commissionStatus,
        commissionPayableOn: commission.commissionPayableOn,
        firstDepositApprovedAt: commission.firstDepositApprovedAt,
        isActiveInvestor: true,
      };
    }

    if (pending) {
      return {
        ...base,
        firstDepositAmount: pending.amount,
        firstDepositStatus: "deposit_pending" as const,
        commissionStatus: "awaiting_approval" as const,
        isActiveInvestor: false,
      };
    }

    return { ...base, isActiveInvestor: false };
  });

  const totalFirstDeposits = referrals
    .filter((r) => r.firstDepositStatus === "approved")
    .reduce((s, r) => s + r.firstDepositAmount, 0);
  const totalCommissionEarned = referrals.reduce((s, r) => s + r.commissionEarned, 0);
  const totalCommissionPending = referrals.reduce((s, r) => s + r.commissionPending, 0);
  const activeClients = referrals.filter((r) => r.isActiveInvestor).length;

  const monthlyTargets = buildMonthlyTargets(
    referralLedgers.map(({ user, approved, ledger }) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      firstDepositApprovedAt: approved?.date ?? null,
      transactions: ledger,
    })),
    ambassador.approvedAt
  );

  const currentMonthTarget = monthlyTargets.find((m) => m.isCurrentMonth) ?? monthlyTargets[monthlyTargets.length - 1];

  return {
    ambassador: {
      id: ambassador.id,
      username: ambassador.username,
      email: ambassador.email,
      firstName: ambassador.firstName,
      lastName: ambassador.lastName,
      referralCode: ambassador.referralCode,
      referralUrl: ambassadorReferralUrl(ambassador.referralCode),
      commissionRatePercent: ambassador.commissionRatePercent,
    },
    monthlyTarget: {
      requiredPerMonth: MONTHLY_ACTIVE_CLIENT_TARGET,
      rules: [
        "Onboard at least one active investing client every calendar month.",
        "The client’s first opening deposit must be approved in that month.",
        "The same client must complete an approved profit withdrawal in that same month.",
      ],
    },
    currentMonth: currentMonthTarget
      ? {
          label: currentMonthTarget.label,
          target: currentMonthTarget.target,
          qualified: currentMonthTarget.qualified,
          met: currentMonthTarget.met,
          qualifiedClients: currentMonthTarget.qualifiedClients,
          pendingClients: currentMonthTarget.pendingClients,
        }
      : null,
    monthlyTargets,
    stats: {
      totalReferrals: referrals.length,
      activeClients,
      totalFirstDeposits,
      totalCommissionEarned,
      totalCommissionPending,
      totalCommission: totalCommissionEarned + totalCommissionPending,
    },
    commissionRatePercent: ambassador.commissionRatePercent,
    referrals,
  };
}

/** Full ambassador profile for admin — application + live commission/referral dashboard */
export async function getAdminAmbassadorProfile(ambassadorId: string) {
  const row = await prisma.brandAmbassador.findUnique({
    where: { id: ambassadorId },
    include: {
      application: true,
    },
  });
  if (!row) return null;

  const dashboard = await getAmbassadorDashboard(ambassadorId);
  if (!dashboard) return null;

  return {
    profile: {
      id: row.id,
      username: row.username,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      referralCode: row.referralCode,
      referralUrl: ambassadorReferralUrl(row.referralCode),
      status: row.status,
      approvedAt: row.approvedAt,
      createdAt: row.createdAt,
      managerLoginUrl: managerPortalUrl(),
      commissionRatePercent: row.commissionRatePercent,
    },
    application: row.application
      ? {
          id: row.application.id,
          firstName: row.application.firstName,
          lastName: row.application.lastName,
          email: row.application.email,
          phone: row.application.phone,
          city: row.application.city,
          state: row.application.state,
          linkedin: row.application.linkedin,
          experience: row.application.experience,
          message: row.application.message,
          status: row.application.status,
          reviewNote: row.application.reviewNote,
          reviewedAt: row.application.reviewedAt,
          createdAt: row.application.createdAt,
        }
      : null,
    commissionRatePercent: row.commissionRatePercent,
    monthlyTarget: dashboard.monthlyTarget,
    currentMonth: dashboard.currentMonth,
    monthlyTargets: dashboard.monthlyTargets,
    stats: dashboard.stats,
    referrals: dashboard.referrals,
  };
}

/** Admin sets this ambassador's commission % of first approved deposit */
export async function adminUpdateAmbassadorCommission(
  ambassadorId: string,
  commissionRatePercent: number
) {
  if (!Number.isFinite(commissionRatePercent)) {
    throw new Error("Commission rate must be a number");
  }
  if (commissionRatePercent < 0 || commissionRatePercent > 100) {
    throw new Error("Commission rate must be between 0 and 100");
  }

  return prisma.brandAmbassador.update({
    where: { id: ambassadorId },
    data: { commissionRatePercent },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      referralCode: true,
      commissionRatePercent: true,
    },
  });
}

export type AdminAmbassadorProfileUpdate = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  username?: string;
  status?: string;
  referralCode?: string;
  newPassword?: string;
};

/** Admin edits ambassador contact / login profile fields */
export async function adminUpdateAmbassadorProfile(
  ambassadorId: string,
  input: AdminAmbassadorProfileUpdate
) {
  const existing = await prisma.brandAmbassador.findUnique({ where: { id: ambassadorId } });
  if (!existing) throw new Error("Ambassador not found");

  const data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    username?: string;
    status?: string;
    referralCode?: string;
    passwordHash?: string;
  } = {};

  if (input.firstName !== undefined) {
    const v = input.firstName.trim();
    if (!v) throw new Error("First name is required");
    data.firstName = v;
  }
  if (input.lastName !== undefined) {
    const v = input.lastName.trim();
    if (!v) throw new Error("Last name is required");
    data.lastName = v;
  }
  if (input.phone !== undefined) {
    const v = input.phone.trim();
    if (!v) throw new Error("Phone is required");
    data.phone = v;
  }
  if (input.status !== undefined) {
    const status = input.status.trim().toLowerCase();
    if (!["active", "inactive", "suspended"].includes(status)) {
      throw new Error("Status must be active, inactive, or suspended");
    }
    data.status = status;
  }
  if (input.email !== undefined) {
    const email = input.email.toLowerCase().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid email address");
    }
    const clash = await prisma.brandAmbassador.findFirst({
      where: { email, NOT: { id: ambassadorId } },
      select: { id: true },
    });
    if (clash) throw new Error("Another ambassador already uses this email");
    data.email = email;
  }
  if (input.username !== undefined) {
    const username = input.username.trim().toLowerCase();
    if (username.length < 4) throw new Error("Username must be at least 4 characters");
    if (!/^[a-z0-9._-]+$/.test(username)) {
      throw new Error("Username may only contain letters, numbers, dots, dashes, and underscores");
    }
    const clash = await prisma.brandAmbassador.findFirst({
      where: { username, NOT: { id: ambassadorId } },
      select: { id: true },
    });
    if (clash) throw new Error("Another ambassador already uses this username");
    data.username = username;
  }
  if (input.referralCode !== undefined) {
    const code = input.referralCode.trim().toUpperCase().replace(/\s/g, "");
    if (code.length < 4) throw new Error("Referral code must be at least 4 characters");
    const clash = await prisma.brandAmbassador.findFirst({
      where: { referralCode: code, NOT: { id: ambassadorId } },
      select: { id: true },
    });
    if (clash) throw new Error("This referral code is already in use");
    data.referralCode = code;
  }
  if (input.newPassword !== undefined && input.newPassword.length > 0) {
    if (input.newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters");
    }
    data.passwordHash = await hashPassword(input.newPassword);
  }

  if (Object.keys(data).length === 0) {
    throw new Error("No profile fields to update");
  }

  return prisma.brandAmbassador.update({
    where: { id: ambassadorId },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      username: true,
      referralCode: true,
      status: true,
      commissionRatePercent: true,
    },
  });
}
