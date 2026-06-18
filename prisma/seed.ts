import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createDemoPortfolio } from "../src/lib/portfolio-engine";

const prisma = new PrismaClient();

const DEMO_EMAIL = "client@awsvision.com";
const DEMO_PASSWORD = "demo1234";
const ADMIN_EMAIL = process.env.ADMIN_PORTAL_EMAIL || process.env.ADMIN_EMAIL || "admin@awsvision.com";
const ADMIN_PASSWORD = process.env.ADMIN_PORTAL_PASSWORD || "admin1234";

async function seedAdmin() {
  const existing = await prisma.admin.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log("Admin user already exists — skipping admin seed");
    return;
  }
  await prisma.admin.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
      name: "AWS Vision Admin",
      role: "admin",
    },
  });
  console.log(`Seeded admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

async function seedDemoUser() {
  const existing = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: { accounts: true },
  });

  if (existing) {
    await prisma.portfolioAccount.updateMany({
      where: { userId: existing.id },
      data: { principal: 0, profitEligibleAt: null },
    });
    await prisma.transaction.updateMany({
      where: {
        userId: existing.id,
        type: "deposit",
        status: { in: ["completed", "pending"] },
      },
      data: {
        status: "failed",
        description: "Legacy demo deposit [legacy reset — new deposit required]",
      },
    });
    console.log("Demo user exists — portfolio reset to $0 (deposit required)");
    return;
  }

  const portfolio = createDemoPortfolio();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  await prisma.user.create({
    data: {
      id: "usr_001",
      email: DEMO_EMAIL,
      passwordHash,
      firstName: "Sarah",
      lastName: "Mitchell",
      phone: "+1 (469) 754-2201",
      kycStatus: "verified",
      profileType: "individual",
      createdAt: new Date("2024-03-15T10:00:00Z"),
      accounts: {
        create: portfolio.accounts.map((a) => ({
          id: a.id,
          accountNumber: a.accountNumber,
          type: a.type,
          principal: a.principal,
          monthlyRatePercent: a.monthlyRatePercent,
          investmentPlanId: a.investmentPlanId,
          maturityDate: a.maturityDate ? new Date(a.maturityDate) : null,
          status: a.status,
          createdAt: new Date(a.createdAt),
        })),
      },
      transactions: {
        create: portfolio.transactions.map((t) => ({
          id: t.id,
          accountId: t.accountId,
          type: t.type,
          amount: t.amount,
          description: t.description,
          status: t.status,
          date: new Date(t.date),
        })),
      },
    },
  });

  console.log(`Seeded demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

async function main() {
  await seedAdmin();
  await seedDemoUser();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
