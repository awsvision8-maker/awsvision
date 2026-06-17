import { prisma } from "@/lib/prisma";

export async function saveContactMessage(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}) {
  return prisma.contactMessage.create({ data });
}

export async function saveWaitlistEntry(listType: string, email: string) {
  return prisma.waitlistEntry.upsert({
    where: { listType_email: { listType, email: email.toLowerCase() } },
    create: { listType, email: email.toLowerCase() },
    update: {},
  });
}

export async function saveAppointment(data: {
  fullName: string;
  email: string;
  phone?: string;
  preferredDate?: string;
  topic: string;
}) {
  return prisma.appointmentRequest.create({ data });
}

export async function saveWithdrawal(data: {
  userId: string;
  accountId: string;
  amount: number;
  method: string;
  reference: string;
}) {
  return prisma.withdrawalRequest.create({ data });
}
