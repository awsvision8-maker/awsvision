import { listAllUsers } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { mapUser } from "@/lib/server/user-mapper";
import { buildPortfolioSnapshot } from "@/lib/portfolio-engine";
import {
  computeProfitFromAgreementDate,
  isPromoDailyStyleAccount,
  pickEarliestAgreementForAccount,
} from "@/lib/agreement-profit";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const users = await listAllUsers();
    const asOf = new Date();

    return jsonOk({
      users: users.map((u) => {
        const mapped = mapUser(u);
        const snapshot = buildPortfolioSnapshot(mapped, asOf);
        const agreements = u.investmentAgreements ?? [];

        const accounts = snapshot.portfolioAccounts.map((pa) => {
          const display = snapshot.accounts.find((a) => a.id === pa.id);
          const ledger = u.accounts.find((a) => a.id === pa.id);
          const sent = u.transactions
            .filter(
              (t) =>
                t.accountId === pa.id &&
                t.type === "withdrawal" &&
                t.status === "completed"
            )
            .reduce((sum, t) => sum + t.amount, 0);

          const promoStyle = isPromoDailyStyleAccount({
            investmentPlanId: pa.investmentPlanId,
            dailyCompoundActive: ledger?.dailyCompoundActive,
          });

          const agreement = pickEarliestAgreementForAccount(agreements, pa.id);
          let profit = 0;
          let balance = display?.balance ?? pa.principal;
          let agreementIssuedAt: string | null = null;
          let profitSource: "promo" | "agreement" | "none" = "none";

          if (promoStyle) {
            // Daily compound / promo FD — engine balance already includes profit
            profit = Math.max(0, Math.round((balance - pa.principal) * 100) / 100);
            profitSource = "promo";
          } else if (agreement) {
            agreementIssuedAt = new Date(agreement.issuedAt).toISOString();
            const monthlyRate =
              pa.monthlyRatePercent > 0
                ? pa.monthlyRatePercent
                : agreement.monthlyRatePercent ?? 0;
            profit = computeProfitFromAgreementDate({
              principal: pa.principal,
              monthlyRatePercent: monthlyRate,
              agreementIssuedAt: agreement.issuedAt,
              accountType: pa.type,
              asOf,
            });
            balance = Math.round((pa.principal + profit) * 100) / 100;
            profitSource = "agreement";
          } else {
            // Fallback: engine profit if any
            profit = Math.max(0, Math.round((balance - pa.principal) * 100) / 100);
          }

          return {
            id: pa.id,
            type: pa.type,
            principal: pa.principal,
            balance: Math.round(balance * 100) / 100,
            profit,
            sent: Math.round(sent * 100) / 100,
            status: pa.status,
            investmentPlanId: pa.investmentPlanId ?? null,
            agreementIssuedAt,
            profitSource,
            monthlyRatePercent: pa.monthlyRatePercent,
          };
        });

        return {
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          onlineId: u.onlineId,
          kycStatus: u.kycStatus,
          profileType: u.profileType,
          createdAt: u.createdAt.toISOString(),
          accounts,
          transactionCount: u._count.transactions,
          withdrawalCount: u._count.withdrawalRequests,
          ambassador: u.ambassador
            ? {
                name: `${u.ambassador.firstName} ${u.ambassador.lastName}`,
                referralCode: u.ambassador.referralCode,
              }
            : null,
          nonprofit: u.nonprofitProfile
            ? {
                organizationLegalName: u.nonprofitProfile.organizationLegalName,
                ein: u.nonprofitProfile.ein,
                fundCapital: u.nonprofitProfile.fundCapital,
                monthlyRate: u.nonprofitProfile.monthlyRate,
              }
            : null,
        };
      }),
    });
  } catch (err) {
    console.error("Admin users error:", err);
    return jsonError("Failed to load users", 500);
  }
}
