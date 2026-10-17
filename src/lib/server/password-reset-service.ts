import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { findUserByLoginIdentifier, hashPassword } from "@/lib/server/auth-service";
import { passwordResetEmail } from "@/lib/server/email-templates";
import { sendMailAsync } from "@/lib/server/mail";
import { SITE } from "@/lib/site-config";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const MIN_PASSWORD_LENGTH = 8;

function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

export function validateNewPassword(password: string): string | null {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

/**
 * Creates a reset token and emails the link.
 * Always returns ok — does not reveal whether the account exists.
 */
export async function requestPasswordReset(identifier: string) {
  const user = await findUserByLoginIdentifier(identifier);
  if (!user) {
    return { ok: true as const };
  }

  // Invalidate unused prior tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, usedAt: null },
  });

  const rawToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt,
    },
  });

  const resetUrl = `${SITE.url}/reset-password?token=${rawToken}`;
  const mail = passwordResetEmail(
    { firstName: user.firstName, email: user.email },
    resetUrl
  );
  sendMailAsync({ to: user.email, ...mail });

  return { ok: true as const };
}

export async function resetPasswordWithToken(rawToken: string, newPassword: string) {
  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    return { ok: false as const, error: passwordError };
  }

  const tokenHash = hashToken(rawToken.trim());
  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) {
    return {
      ok: false as const,
      error: "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: row.userId, usedAt: null, id: { not: row.id } },
    }),
    // Sign out all existing sessions after password change
    prisma.session.deleteMany({
      where: { userId: row.userId },
    }),
  ]);

  return { ok: true as const };
}
