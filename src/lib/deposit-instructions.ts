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
    desc: "Send ACH, then upload your payment confirmation slip to submit",
    timing: "3–5 business days · No fee · Slip screenshot required",
  },
  {
    id: "wire" as const,
    label: "Wire Transfer",
    desc: "Send wire, then upload your payment confirmation slip to submit",
    timing: "1–2 business days · No fee · Slip screenshot required",
  },
  {
    id: "echeck" as const,
    label: "eCheck Deposit",
    desc: "Screenshots of front and back of your check are required to submit",
    timing: "Processing: 2–4 business days after verification",
  },
  {
    id: "zelle" as const,
    label: "Zelle Payment",
    desc: `Send to ${ZELLE_DEPOSIT.email}, then upload your Zelle confirmation screenshot`,
    timing: "Typically minutes · Confirmation screenshot required",
  },
] as const;

export type DepositMethodId = (typeof DEPOSIT_METHODS)[number]["id"];

/** Methods that require a payment-slip / confirmation screenshot (single image). */
export function depositMethodNeedsSlip(method: DepositMethodId) {
  return method === "ach" || method === "wire" || method === "zelle";
}

export function buildDepositReference(suffix: string) {
  return `DEP-${suffix}`;
}
