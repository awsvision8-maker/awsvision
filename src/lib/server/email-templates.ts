import { formatSitePhones, formatUsHeadquarters, SITE } from "@/lib/site-config";
import { formatCurrency } from "@/lib/utils";
import type { User } from "@/types";

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
        <tr><td style="background:linear-gradient(135deg,#0f172a,#0d9488);padding:28px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;">AWS Vision</h1>
          <p style="margin:8px 0 0;color:#99f6e4;font-size:13px;">${SITE.tagline}</p>
        </td></tr>
        <tr><td style="padding:32px;color:#334155;font-size:15px;line-height:1.6;">${body}</td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;">
          ${SITE.name} · ${SITE.email} · ${formatSitePhones()}<br>
          ${formatUsHeadquarters()}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function p(text: string) {
  return `<p style="margin:0 0 16px;">${text}</p>`;
}

function btn(href: string, label: string) {
  return `<p style="margin:24px 0;"><a href="${href}" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">${label}</a></p>`;
}

export function welcomeSignupEmail(user: User, accountType: string) {
  const name = `${user.firstName} ${user.lastName}`;
  const body = [
    p(`Hello ${name},`),
    p(`Thank you for opening your <strong>${accountType}</strong> account with AWS Vision. Your application has been received and is under review.`),
    p(`<strong>Online ID:</strong> ${user.onlineId ?? "—"}<br><strong>Email:</strong> ${user.email}`),
    p("Once verified, you can sign in to the client portal to track portfolio growth, download statements, and manage deposits."),
    btn(`${SITE.url}/login`, "Sign In to Portal"),
    p(`Questions? Reply to this email or call ${formatSitePhones(" or ")}.`),
  ].join("");
  return {
    subject: `Welcome to AWS Vision — Application Received`,
    html: layout("Welcome", body),
    text: `Hello ${name}, your AWS Vision account application has been received.`,
  };
}

export function welcomeNonprofitEmail(user: User, orgName: string) {
  const name = `${user.firstName} ${user.lastName}`;
  const body = [
    p(`Hello ${name},`),
    p(`Thank you for enrolling <strong>${orgName}</strong> in the AWS Vision Non-Profit Program.`),
    p("Our team will review your organization documents and fund capital enrollment within 1–2 business days."),
    btn(`${SITE.url}/login`, "Organization Sign In"),
    p(`Support: ${SITE.email} · ${formatSitePhones()}`),
  ].join("");
  return {
    subject: `Non-Profit Enrollment Received — ${orgName}`,
    html: layout("Non-Profit Enrollment", body),
    text: `Non-profit enrollment received for ${orgName}.`,
  };
}

export function depositConfirmationEmail(
  user: User,
  amount: number,
  description: string,
  accountLabel: string
) {
  const name = `${user.firstName} ${user.lastName}`;
  const body = [
    p(`Hello ${name},`),
    p(`We received your deposit request of <strong>${formatCurrency(amount)}</strong> to your <strong>${accountLabel}</strong> account.`),
    p(`<strong>Method:</strong> ${description}`),
    p("Your deposit is <strong>pending admin review</strong>. Funds will appear in your balance after approval. Monthly profit accrual begins 30 days after your first approved deposit."),
    btn(`${SITE.url}/portal/dashboard`, "View Dashboard"),
  ].join("");
  return {
    subject: `Deposit Request Received — ${formatCurrency(amount)}`,
    html: layout("Deposit Confirmation", body),
    text: `Deposit request of ${formatCurrency(amount)} received.`,
  };
}

export function depositAdminEmail(user: User, amount: number, description: string) {
  const body = [
    p(`<strong>Client:</strong> ${user.firstName} ${user.lastName} (${user.email})`),
    p(`<strong>Amount:</strong> ${formatCurrency(amount)}`),
    p(`<strong>Details:</strong> ${description}`),
    p(`<strong>Action required:</strong> Review and approve in the <a href="${SITE.url}/admin/deposits">Admin Deposits</a> portal.`),
  ].join("");
  return {
    subject: `[Admin] Pending Deposit — ${formatCurrency(amount)} from ${user.email}`,
    html: layout("Pending Deposit", body),
    text: `Pending deposit ${formatCurrency(amount)} from ${user.email} — approve in admin portal`,
  };
}

export function depositApprovedEmail(
  user: User,
  amount: number,
  description: string,
  accountLabel: string,
  profitEligibleDate: string
) {
  const name = `${user.firstName} ${user.lastName}`;
  const body = [
    p(`Hello ${name},`),
    p(`Your deposit of <strong>${formatCurrency(amount)}</strong> to <strong>${accountLabel}</strong> has been <strong>approved</strong>.`),
    p(`<strong>Reference:</strong> ${description}`),
    p(`The funds are now reflected in your account balance. Monthly profit accrual will begin on <strong>${profitEligibleDate}</strong> (30 days after approval).`),
    btn(`${SITE.url}/portal/dashboard`, "View Dashboard"),
  ].join("");
  return {
    subject: `Deposit Approved — ${formatCurrency(amount)}`,
    html: layout("Deposit Approved", body),
    text: `Deposit of ${formatCurrency(amount)} approved. Profit accrual begins ${profitEligibleDate}.`,
  };
}

export function withdrawalConfirmationEmail(
  user: User,
  amount: number,
  method: string,
  reference: string,
  accountLabel: string
) {
  const name = `${user.firstName} ${user.lastName}`;
  const methodLabel = method === "wire" ? "Wire Transfer" : "Bank Transfer";
  const body = [
    p(`Hello ${name},`),
    p(`Your withdrawal request for <strong>${formatCurrency(amount)}</strong> from <strong>${accountLabel}</strong> has been submitted.`),
    p(`<strong>Method:</strong> ${methodLabel}<br><strong>Reference:</strong> ${reference}`),
    p("Processing typically takes 2–3 business days. You will receive another email when funds are sent."),
    btn(`${SITE.url}/portal/withdraw`, "View Withdrawal Status"),
  ].join("");
  return {
    subject: `Withdrawal Request — ${reference}`,
    html: layout("Withdrawal Request", body),
    text: `Withdrawal request ${reference} for ${formatCurrency(amount)}.`,
  };
}

export function withdrawalAdminEmail(
  user: User,
  amount: number,
  method: string,
  reference: string
) {
  const body = [
    p(`<strong>Client:</strong> ${user.firstName} ${user.lastName} (${user.email})`),
    p(`<strong>Amount:</strong> ${formatCurrency(amount)}`),
    p(`<strong>Method:</strong> ${method}<br><strong>Reference:</strong> ${reference}`),
  ].join("");
  return {
    subject: `[Admin] Withdrawal Request ${reference}`,
    html: layout("Withdrawal Alert", body),
    text: `Withdrawal ${reference} from ${user.email}`,
  };
}

export function contactAckEmail(firstName: string, topic: string) {
  const body = [
    p(`Hello ${firstName},`),
    p(`Thank you for contacting AWS Vision regarding <strong>${topic}</strong>.`),
    p("A relationship manager will respond within 1 business day."),
    p(`For urgent matters, call ${formatSitePhones(" or ")}.`),
  ].join("");
  return {
    subject: `We received your message — AWS Vision`,
    html: layout("Message Received", body),
    text: `Thanks for contacting AWS Vision about ${topic}.`,
  };
}

export function contactAdminEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}) {
  const body = [
    p(`<strong>From:</strong> ${data.firstName} ${data.lastName}`),
    p(`<strong>Email:</strong> ${data.email}${data.phone ? `<br><strong>Phone:</strong> ${data.phone}` : ""}`),
    p(`<strong>Topic:</strong> ${data.topic}`),
    p(`<strong>Message:</strong><br>${data.message.replace(/\n/g, "<br>")}`),
  ].join("");
  return {
    subject: `[Contact] ${data.topic} — ${data.firstName} ${data.lastName}`,
    html: layout("New Contact Message", body),
    text: `Contact from ${data.email}: ${data.message}`,
  };
}

export function waitlistEmail(email: string, listLabel: string) {
  const body = [
    p("You're on the list!"),
    p(`We've added <strong>${email}</strong> to the <strong>${listLabel}</strong> waitlist.`),
    p("We'll email you as soon as applications open — no further action needed."),
    btn(`${SITE.url}/signup`, "Open an Account Today"),
  ].join("");
  return {
    subject: `You're on the ${listLabel} waitlist — AWS Vision`,
    html: layout("Waitlist Confirmation", body),
    text: `Added to ${listLabel} waitlist.`,
  };
}

export function waitlistAdminEmail(email: string, listLabel: string) {
  const body = p(`New waitlist signup: <strong>${email}</strong> for <strong>${listLabel}</strong>.`);
  return {
    subject: `[Waitlist] ${listLabel} — ${email}`,
    html: layout("Waitlist Signup", body),
    text: `${email} joined ${listLabel}`,
  };
}

export function appointmentConfirmationEmail(data: {
  fullName: string;
  email: string;
  preferredDate?: string;
  topic: string;
}) {
  const body = [
    p(`Hello ${data.fullName},`),
    p(`Your appointment request for <strong>${data.topic}</strong> has been received.`),
    data.preferredDate ? p(`<strong>Preferred date:</strong> ${data.preferredDate}`) : "",
    p("Our team will confirm your appointment by email or phone within 1 business day."),
    p(`Direct line: ${formatSitePhones(" or ")}`),
  ].join("");
  return {
    subject: `Appointment Request Received — AWS Vision`,
    html: layout("Appointment Request", body),
    text: `Appointment request for ${data.topic} received.`,
  };
}

export function appointmentAdminEmail(data: {
  fullName: string;
  email: string;
  phone?: string;
  preferredDate?: string;
  topic: string;
}) {
  const body = [
    p(`<strong>Name:</strong> ${data.fullName}`),
    p(`<strong>Email:</strong> ${data.email}${data.phone ? `<br><strong>Phone:</strong> ${data.phone}` : ""}`),
    data.preferredDate ? p(`<strong>Preferred date:</strong> ${data.preferredDate}`) : "",
    p(`<strong>Topic:</strong> ${data.topic}`),
  ].join("");
  return {
    subject: `[Appointment] ${data.topic} — ${data.fullName}`,
    html: layout("New Appointment", body),
    text: `Appointment from ${data.fullName}`,
  };
}

export function loginAlertEmail(user: User) {
  const name = `${user.firstName} ${user.lastName}`;
  const body = [
    p(`Hello ${name},`),
    p(`A sign-in to your AWS Vision client portal was detected at <strong>${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</strong>.`),
    p("If this wasn't you, contact us immediately at " + formatSitePhones(" or ") + "."),
    btn(`${SITE.url}/portal/dashboard`, "View Account"),
  ].join("");
  return {
    subject: `Sign-in to your AWS Vision account`,
    html: layout("Sign-in Alert", body),
    text: `Sign-in detected on your AWS Vision account.`,
  };
}

export function kycVerifiedEmail(user: User) {
  const name = `${user.firstName} ${user.lastName}`;
  const body = [
    p(`Hello ${name},`),
    p("Your identity verification (KYC) has been <strong>approved</strong>. Your account is now fully active."),
    btn(`${SITE.url}/portal/dashboard`, "Go to Dashboard"),
  ].join("");
  return {
    subject: `Identity Verification Approved — AWS Vision`,
    html: layout("KYC Verified", body),
    text: `KYC approved for ${name}.`,
  };
}

export function ambassadorApplicationAckEmail(firstName: string) {
  const body = [
    p(`Hello ${firstName},`),
    p("Thank you for applying to the AWS Vision Brand Ambassador & Referral Program. Our team will review your application and respond within 2–3 business days."),
    p("If approved, you will receive your manager portal username, password, and personal referral link by email."),
    btn(`${SITE.url}/referral-program`, "View Program Details"),
  ].join("");
  return {
    subject: "Brand Ambassador Application Received — AWS Vision",
    html: layout("Application Received", body),
    text: `We received your brand ambassador application, ${firstName}.`,
  };
}

export function ambassadorApplicationAdminEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}) {
  const body = [
    p(`<strong>${data.firstName} ${data.lastName}</strong> applied to join the Brand Ambassador program.`),
    p(`Email: ${data.email}<br>Phone: ${data.phone}`),
    p(data.message),
    btn(`${SITE.url}/admin/ambassadors`, "Review in Admin Portal"),
  ].join("");
  return {
    subject: `[Ambassador] New application — ${data.firstName} ${data.lastName}`,
    html: layout("New Ambassador Application", body),
    text: `New ambassador application from ${data.email}`,
  };
}

export function ambassadorApprovedEmail(data: {
  firstName: string;
  username: string;
  password: string;
  loginUrl: string;
  referralCode: string;
  referralUrl: string;
}) {
  const body = [
    p(`Congratulations ${data.firstName}!`),
    p("Your AWS Vision Brand Ambassador application has been <strong>approved</strong>. You can now access your dedicated manager portal to refer clients and track performance."),
    p(`<strong>Manager portal:</strong> <a href="${data.loginUrl}">${data.loginUrl}</a>`),
    p(`<strong>Username:</strong> ${data.username}<br><strong>Temporary password:</strong> ${data.password}`),
    p(`<strong>Your referral code:</strong> ${data.referralCode}<br><strong>Referral link:</strong> <a href="${data.referralUrl}">${data.referralUrl}</a>`),
    p("Please sign in and change your password after your first login. Share your referral link or code with prospective investors — you earn a 3% one-time commission on each client's first approved opening deposit, credited after the calendar month ends."),
    btn(data.loginUrl, "Sign In to Manager Portal"),
  ].join("");
  return {
    subject: "Welcome — AWS Vision Brand Ambassador Portal Access",
    html: layout("Ambassador Approved", body),
    text: `Approved. Login: ${data.loginUrl} Username: ${data.username} Password: ${data.password}`,
  };
}

export function ambassadorRejectedEmail(firstName: string, note?: string) {
  const body = [
    p(`Hello ${firstName},`),
    p("Thank you for your interest in the AWS Vision Brand Ambassador program. After review, we are unable to approve your application at this time."),
    note ? p(note) : "",
    p(`You may contact us at ${SITE.email} if you have questions.`),
  ].join("");
  return {
    subject: "Brand Ambassador Application Update — AWS Vision",
    html: layout("Application Update", body),
    text: `Application not approved at this time.`,
  };
}

export const WAITLIST_LABELS: Record<string, string> = {
  newsletter: "Newsletter",
  products: "Products Opening Soon",
  credit_cards: "Credit Card Launch",
  loans: "Loan Facility Launch",
};
