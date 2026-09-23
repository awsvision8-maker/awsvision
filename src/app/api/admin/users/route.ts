import { listUsersForAdminList } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import {
  computeProfitFromAgreementDate,
  isPromoDailyStyleAccount,
  pickEarliestAgreementForAccount,
} from "@/lib/agreement-profit";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { users, sentByAccount } = await listUsersForAdminList();
    const asOf = new Date();

    return jsonOk({
      users: users.map((u) => {
        const accounts = u.accounts.map((pa) => {
          const sent = sentByAccount.get(pa.id) ?? 0;
          const promoStyle = isPromoDailyStyleAccount({
            investmentPlanId: pa.investmentPlanId,
            dailyCompoundActive: pa.dailyCompoundActive,
          });

          const agreement = pickEarliestAgreementForAccount(
            u.investmentAgreements,
            pa.id
          );
          let profit = 0;
          let balance = pa.principal;
          let agreementIssuedAt: string | null = null;
          let profitSource: "promo" | "agreement" | "none" = "none";
          let monthlyRatePercent = pa.monthlyRatePercent ?? 0;

          if (promoStyle) {
            // Live promo P&L needs full ledger — open user profile for exact figures
            profitSource = "promo";
          } else if (agreement) {
            agreementIssuedAt = new Date(agreement.issuedAt).toISOString();
            monthlyRatePercent =
              pa.monthlyRatePercent > 0
                ? pa.monthlyRatePercent
                : agreement.monthlyRatePercent ?? 0;
            profit = computeProfitFromAgreementDate({
              principal: pa.principal,
              monthlyRatePercent,
              agreementIssuedAt: agreement.issuedAt,
              accountType: pa.type,
              asOf,
            });
            balance = Math.round((pa.principal + profit) * 100) / 100;
            profitSource = "agreement";
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
            monthlyRatePercent,
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
