/**
 * One-time / manual reset: zero all balances and invalidate deposit history.
 * Run: npx tsx scripts/reset-portfolio-balances.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const accounts = await prisma.portfolioAccount.updateMany({
    data: { principal: 0, profitEligibleAt: null },
  });

  const deposits = await prisma.transaction.findMany({
    where: { type: "deposit", status: { in: ["completed", "pending"] } },
    select: { id: true, description: true },
  });

  let invalidated = 0;
  for (const tx of deposits) {
    if (tx.description.includes("[legacy reset]")) continue;
    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        status: "failed",
        description: `${tx.description} [legacy reset — new deposit required]`,
      },
    });
    invalidated++;
  }

  console.log(`Reset ${accounts.count} account(s) to $0 principal.`);
  console.log(`Invalidated ${invalidated} deposit transaction(s).`);
  console.log("Users must submit a new deposit and receive admin approval.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
