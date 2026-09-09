import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = "promo50k@awsvision.com";
const PASSWORD = "promo1234";

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: EMAIL },
  });
  if (existing) {
    await prisma.transaction.deleteMany({ where: { userId: existing.id } });
    await prisma.portfolioAccount.deleteMany({ where: { userId: existing.id } });
    await prisma.session.deleteMany({ where: { userId: existing.id } });
    await prisma.userNotification.deleteMany({ where: { userId: existing.id } }).catch(() => undefined);
    await prisma.investmentAgreement.deleteMany({ where: { userId: existing.id } }).catch(() => undefined);
    await prisma.withdrawalRequest.deleteMany({ where: { userId: existing.id } }).catch(() => undefined);
    await prisma.user.delete({ where: { id: existing.id } });
    console.log("Removed old promo50k user");
  }

  const now = new Date();
  // Start 14 days ago so graph already has ~13 days of 0.5% compounding
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 14)
  );
  const firstProfit = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 1)
  );
  const end = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 120)
  );
  const depositDate = new Date(start.getTime() - 2 * 86_400_000);
  const accountId = "acc_promo50k_demo";
  const userId = "usr_promo50k_demo";

  await prisma.user.create({
    data: {
      id: userId,
      email: EMAIL,
      passwordHash: await bcrypt.hash(PASSWORD, 12),
      firstName: "Promo",
      lastName: "Tester",
      phone: "+1 (555) 050-0000",
      onlineId: "PROMO50K",
      kycStatus: "verified",
      profileType: "individual",
      createdAt: depositDate,
      accounts: {
        create: {
          id: accountId,
          accountNumber: "AV-FD-50K-DEMO",
          type: "fixed_deposit",
          principal: 50_000,
          monthlyRatePercent: 15,
          investmentPlanId: "july-promo-fd",
          status: "active",
          profitEligibleAt: firstProfit,
          maturityDate: end,
          createdAt: depositDate,
          dailyCompoundActive: true,
          dailyCompoundStartDate: start,
          dailyCompoundEndDate: end,
          dailyCompoundRatePercent: 0.5,
        },
      },
      transactions: {
        create: {
          id: "tx_promo50k_deposit",
          accountId,
          type: "deposit",
          amount: 50_000,
          description: "July Wealth Accelerator FD — 50000 demo deposit",
          status: "completed",
          date: depositDate,
        },
      },
    },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        loginUrl: "https://awsvision.com/login",
        email: EMAIL,
        password: PASSWORD,
        onlineId: "PROMO50K",
        principal: 50000,
        plan: "july-promo-fd",
        dailyCompoundStart: start.toISOString().slice(0, 10),
        firstProfit: firstProfit.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
