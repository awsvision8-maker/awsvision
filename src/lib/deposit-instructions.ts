/** Portal deposit instructions — wire, ACH, eCheck, and Zelle */

export const DEPOSIT_BANK_DETAILS = {
  accountTitle: "TEAMBASE TAX & ACCOUNTING SERVICES LLC",
  accountNumber: "2915646531",
  routingNumber: "044000037",
  bankName: "AWS Vision Partner Bank",
} as const;

export const ZELLE_DEPOSIT = {
  email: "henry.james@awsvision.com",
  displayName: "AWS Vision Deposits",
} as const;

export const DEPOSIT_METHODS = [
  {
    id: "wire_ach" as const,
    label: "Wire / ACH Transfer",
    desc: "Send funds from your bank using the account details below",
    timing: "Wire: 1–2 business days · ACH: 3–5 business days · No fee",
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
