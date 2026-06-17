import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createDemoPortfolio } from "../src/lib/portfolio-engine";

const prisma = new PrismaClient();

const DEMO_EMAIL = "client@awsvision.com";
const DEMO_PASSWORD = "demo1234";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    console.log("Demo user already exists — skipping seed");
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
