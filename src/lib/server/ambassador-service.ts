import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/server/auth-service";
import { SITE } from "@/lib/site-config";

const REFERRAL_PREFIX = "AV";
const COMMISSION_RATE = 0.03;

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

function referralCommissionFromDeposit(firstDepositAmount: number, firstDepositApprovedAt: Date) {
  const commission = firstDepositAmount * COMMISSION_RATE;
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
    include: { ambassador: { select: { id: true, username: true, referralCode: true } } },
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
      const commission = referralCommissionFromDeposit(approved.amount, approved.date);
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
    referrals,
  };
}
