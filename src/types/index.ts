export type KYCStatus = "pending" | "submitted" | "verified" | "rejected" | "resubmit_required";
export type AccountType = "savings" | "fixed_deposit" | "investment" | "nonprofit_fund";
export type TransactionType = "deposit" | "withdrawal" | "profit" | "fee";
export type ApplicationStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected";

export type ProfileType = "individual" | "nonprofit";

export interface NonprofitProfile {
  organizationLegalName: string;
  dbaName?: string;
  ein: string;
  organizationType: string;
  yearEstablished: string;
  missionStatement: string;
  website?: string;
  fundCapital: number;
  monthlyRate: number;
  representativeName: string;
  representativeTitle: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  kycStatus: KYCStatus;
  createdAt: string;
  onlineId?: string;
  kycData?: KYCData;
  profileType?: ProfileType;
  nonprofitProfile?: NonprofitProfile;
  portfolio?: UserPortfolio;
}

/** Ledger account — principal is deposits; balance is computed with monthly program rate */
export interface PortfolioAccount {
  id: string;
  accountNumber: string;
  type: AccountType;
  principal: number;
  /** Monthly profit / gratuity rate (%) locked at enrollment */
  monthlyRatePercent: number;
  investmentPlanId?: string;
  createdAt: string;
  maturityDate?: string;
  status: "active" | "matured" | "closed";
  /** Profit accrual starts on or after this date (30 days after first approved deposit) */
  profitEligibleAt?: string;
  /** When true, monthlyRatePercent is admin-amended and overrides auto tier matching */
  profitRateAmended?: boolean;
  amendmentNote?: string;
}

export interface UserPortfolio {
  accounts: PortfolioAccount[];
  transactions: Transaction[];
}

export interface NonprofitSignupApplication {
  organizationLegalName: string;
  dbaName: string;
  ein: string;
  organizationType: string;
  yearEstablished: string;
  missionStatement: string;
  website: string;
  expectedFundCapital: string;

  repFirstName: string;
  repLastName: string;
  repTitle: string;
  repEmail: string;
  repPhone: string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  onlineId: string;
  password: string;
  confirmPassword: string;

  taxExemptDocName: string;
  taxExemptDocPreview: string;
  bylawsOrAuthDocName: string;
  bylawsOrAuthDocPreview: string;

  termsAccepted: boolean;
  eSignConsent: boolean;
  patriotActConsent: boolean;
}

export interface SignupApplication {
  accountType: "savings" | "fixed_deposit" | "investment";
  investmentPlanId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  phone: string;
  citizenship: string;
  countryOfBirth: string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mailingSameAsHome: boolean;
  mailingAddressLine1: string;
  mailingAddressLine2: string;
  mailingCity: string;
  mailingState: string;
  mailingPostalCode: string;
  mailingCountry: string;

  employmentStatus: string;
  employer: string;
  occupation: string;
  annualIncome: string;
  sourceOfFunds: string;

  onlineId: string;
  password: string;
  confirmPassword: string;

  idType: "drivers_license" | "passport";
  idNumber: string;
  idExpiry: string;
  idState: string;
  idFrontName: string;
  idFrontPreview: string;
  idBackName: string;
  idBackPreview: string;

  selfieName: string;
  selfiePreview: string;

  termsAccepted: boolean;
  eSignConsent: boolean;
  patriotActConsent: boolean;
  referralCode?: string;
}

export interface KYCData {
  dateOfBirth: string;
  nationality: string;
  ssn?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  idType: string;
  idNumber: string;
  idExpiry?: string;
  occupation: string;
  sourceOfFunds: string;
  employmentStatus?: string;
  employer?: string;
  annualIncome?: string;
  idFrontName?: string;
  idFrontPreview?: string;
  idBackName?: string;
  idBackPreview?: string;
  selfieName?: string;
  selfiePreview?: string;
  taxExemptDocName?: string;
  taxExemptDocPreview?: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  interestRate: number;
  /** Investment plan tier id (silver, gold, etc.) */
  investmentPlanId?: string;
  maturityDate?: string;
  status: "active" | "matured" | "closed";
  createdAt: string;
}

export interface InvestmentHolding {
  id: string;
  name: string;
  sector: string;
  region: string;
  symbol: string;
  allocation: number;
  value: number;
  monthlyReturn: number;
  ytdReturn: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  date: string;
}

export interface MonthlyStatement {
  id: string;
  month: string;
  year: number;
  openingBalance: number;
  closingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  profitEarned: number;
  annualizedReturn: number;
}

export interface ProductApplication {
  id: string;
  productType: "credit_card" | "loan" | "insurance" | "mortgage";
  productName: string;
  amount?: number;
  status: ApplicationStatus;
  submittedAt: string;
}

/** Issued when a verified client's deposit is approved on an investment / FD account */
export interface InvestmentAgreement {
  id: string;
  agreementNumber: string;
  userId: string;
  accountId: string;
  transactionId: string;
  planId: string;
  planName: string;
  monthlyRatePercent: number;
  termMonths: number;
  totalRoiPercent: number;
  depositAmount: number;
  totalPrincipal: number;
  accountNumber: string;
  accountType: string;
  issuedAt: string;
  maturityDate: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  amendedAt?: string;
  amendmentNote?: string;
}
