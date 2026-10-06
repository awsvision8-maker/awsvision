/** Portal deposit instructions — wire, ACH, eCheck, and Zelle */

const ACCOUNT_TITLE = "TEAMBASE TAX & ACCOUNTING SERVICES LLC";
const BANK_NAME = "AWS Vision Partner Bank";

/** ACH (bank transfer) — existing partner-bank details */
export const DEPOSIT_BANK_ACH = {
  accountTitle: ACCOUNT_TITLE,
  accountNumber: "2915646531",
  routingNumber: "044000037",
  bankName: BANK_NAME,
} as const;

/** Domestic wire — separate routing */
export const DEPOSIT_BANK_WIRE = {
  accountTitle: ACCOUNT_TITLE,
  accountNumber: "2915646531",
  routingNumber: "021000021",
  bankName: BANK_NAME,
} as const;

/** @deprecated Prefer DEPOSIT_BANK_ACH / DEPOSIT_BANK_WIRE */
export const DEPOSIT_BANK_DETAILS = DEPOSIT_BANK_ACH;

export const ZELLE_DEPOSIT = {
  email: "henry.james@awsvision.com",
  displayName: "AWS Vision Deposits",
} as const;

export const DEPOSIT_METHODS = [
  {
    id: "ach" as const,
    label: "ACH Transfer",
    desc: "Send an ACH / bank transfer using the ACH account details below",
    timing: "3–5 business days · No fee",
  },
  {
    id: "wire" as const,
    label: "Wire Transfer",
    desc: "Send a domestic wire using the wire account details below",
    timing: "1–2 business days · No fee",
  },
  {
    id: "echeck" as const,
    label: "eCheck Deposit",
    desc: "Upload clear images of the front and back of your check",
    timing: "Processing: 2–4 business days after verification",
  },
  {
    id: "zelle" as const,
    label: "Zelle Payment",
    desc: `Send to ${ZELLE_DEPOSIT.email}`,
    timing: "Typically available within minutes during business hours",
  },
] as const;

export type DepositMethodId = (typeof DEPOSIT_METHODS)[number]["id"];

export function buildDepositReference(suffix: string) {
  return `DEP-${suffix}`;
}
