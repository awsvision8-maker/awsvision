import {
  appointmentAdminEmail,
  appointmentConfirmationEmail,
  contactAckEmail,
  contactAdminEmail,
  depositAdminEmail,
  depositApprovedEmail,
  depositConfirmationEmail,
  kycVerifiedEmail,
  loginAlertEmail,
  WAITLIST_LABELS,
  waitlistAdminEmail,
  waitlistEmail,
  welcomeNonprofitEmail,
  welcomeSignupEmail,
  withdrawalAdminEmail,
  withdrawalConfirmationEmail,
  ambassadorApplicationAckEmail,
  ambassadorApplicationAdminEmail,
  ambassadorApprovedEmail,
  ambassadorRejectedEmail,
  birthdayWishEmail,
  kycReuploadRequestEmail,
} from "@/lib/server/email-templates";
import { adminEmail, sendMailAsync } from "@/lib/server/mail";
import { getAccountLabel, PROFIT_HOLD_DAYS } from "@/lib/portfolio-engine";
import type { User } from "@/types";

export function notifySignup(user: User, accountType: string) {
  const welcome = welcomeSignupEmail(user, accountType);
  sendMailAsync({ to: user.email, ...welcome });
  sendMailAsync({
    to: adminEmail(),
    subject: `[Admin] New Signup — ${user.email}`,
    html: welcome.html,
    text: `New signup: ${user.firstName} ${user.lastName} (${user.email})`,
  });
}

export function notifyNonprofitSignup(user: User, orgName: string) {
  const welcome = welcomeNonprofitEmail(user, orgName);
  sendMailAsync({ to: user.email, ...welcome });
  sendMailAsync({
    to: adminEmail(),
    subject: `[Admin] Non-Profit Signup — ${orgName}`,
    html: welcome.html,
    text: `Non-profit signup: ${orgName}`,
  });
}

export function notifyDeposit(user: User, amount: number, description: string, accountId: string) {
  const account = user.portfolio?.accounts.find((a) => a.id === accountId);
  const label = account ? getAccountLabel(account) : "Account";
  const client = depositConfirmationEmail(user, amount, description, label);
  const admin = depositAdminEmail(user, amount, description);
  sendMailAsync({ to: user.email, ...client });
  sendMailAsync({ to: adminEmail(), ...admin });
}

export function notifyDepositApproved(
  user: User,
  amount: number,
  description: string,
  accountId: string
) {
  const account = user.portfolio?.accounts.find((a) => a.id === accountId);
  const label = account ? getAccountLabel(account) : "Account";
  const profitDate = account?.profitEligibleAt
    ? new Date(account.profitEligibleAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : `in ${PROFIT_HOLD_DAYS} days`;
  const client = depositApprovedEmail(user, amount, description, label, profitDate);
  sendMailAsync({ to: user.email, ...client });
}

export function notifyWithdrawal(
  user: User,
  amount: number,
  method: string,
  reference: string,
  accountId: string
) {
  const account = user.portfolio?.accounts.find((a) => a.id === accountId);
  const label = account ? getAccountLabel(account) : "Account";
  const client = withdrawalConfirmationEmail(user, amount, method, reference, label);
  const admin = withdrawalAdminEmail(user, amount, method, reference);
  sendMailAsync({ to: user.email, ...client });
  sendMailAsync({ to: adminEmail(), ...admin });
}

export function notifyContact(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}) {
  const ack = contactAckEmail(data.firstName, data.topic);
  const admin = contactAdminEmail(data);
  sendMailAsync({ to: data.email, ...ack });
  sendMailAsync({ to: adminEmail(), ...admin, replyTo: data.email });
}

export function notifyWaitlist(email: string, listType: string) {
  const label = WAITLIST_LABELS[listType] ?? listType;
  const client = waitlistEmail(email, label);
  const admin = waitlistAdminEmail(email, label);
  sendMailAsync({ to: email, ...client });
  sendMailAsync({ to: adminEmail(), ...admin });
}

export function notifyAppointment(data: {
  fullName: string;
  email: string;
  phone?: string;
  preferredDate?: string;
  topic: string;
}) {
  const client = appointmentConfirmationEmail(data);
  const admin = appointmentAdminEmail(data);
  sendMailAsync({ to: data.email, ...client });
  sendMailAsync({ to: adminEmail(), ...admin, replyTo: data.email });
}

export function notifyLogin(user: User) {
  const alert = loginAlertEmail(user);
  sendMailAsync({ to: user.email, ...alert });
}

export function notifyKycVerified(user: User) {
  const msg = kycVerifiedEmail(user);
  sendMailAsync({ to: user.email, ...msg });
}

export function notifyAmbassadorApplication(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}) {
  const ack = ambassadorApplicationAckEmail(data.firstName);
  const admin = ambassadorApplicationAdminEmail(data);
  sendMailAsync({ to: data.email, ...ack });
  sendMailAsync({ to: adminEmail(), ...admin, replyTo: data.email });
}

export function notifyAmbassadorApproved(data: {
  email: string;
  firstName: string;
  username: string;
  password: string;
  loginUrl: string;
  referralCode: string;
  referralUrl: string;
}) {
  const msg = ambassadorApprovedEmail(data);
  sendMailAsync({ to: data.email, ...msg });
}

export function notifyAmbassadorRejected(email: string, firstName: string, note?: string) {
  const msg = ambassadorRejectedEmail(firstName, note);
  sendMailAsync({ to: email, ...msg });
}

export function notifyBirthday(user: { email: string; firstName: string; lastName: string }) {
  const msg = birthdayWishEmail(user);
  sendMailAsync({ to: user.email, ...msg });
}

export function notifyKycReuploadRequest(
  user: { email: string; firstName: string; lastName: string },
  documentLabel: string,
  adminNote?: string | null
) {
  const msg = kycReuploadRequestEmail(user, documentLabel, adminNote);
  sendMailAsync({ to: user.email, ...msg });
}
