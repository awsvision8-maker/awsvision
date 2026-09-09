/**
 * End-to-end signup verification for every account package/category.
 * Tests live API → cPanel database persistence, then cleans up test users.
 */
import { Client } from "pg";
import fs from "fs";

const BASE = "https://awsvision.com";
const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const INVESTMENT_PLANS = [
  "silver",
  "gold",
  "diamond",
  "platinum",
  "premium-diamond",
  "executive",
] as const;

type CaseDef = {
  label: string;
  endpoint: string;
  buildPayload: (tag: string) => object;
  expect: {
    profileType: string;
    accountType?: string;
    investmentPlanId?: string | null;
    hasNonprofit?: boolean;
  };
};

function individualBase(tag: string, accountType: string, investmentPlanId = "") {
  const ts = Date.now();
  return {
    accountType,
    investmentPlanId,
    firstName: "Verify",
    middleName: "",
    lastName: tag,
    suffix: "",
    dateOfBirth: "1990-06-15",
    ssn: `987-65-${String(ts).slice(-4)}`,
    email: `verify-${tag.toLowerCase()}-${ts}@awsvision-test.invalid`,
    phone: "+1 (555) 111-2222",
    citizenship: "US",
    countryOfBirth: "United States",
    addressLine1: "100 Test Ave",
    addressLine2: "",
    city: "Dallas",
    state: "TX",
    postalCode: "75201",
    country: "United States",
    mailingSameAsHome: true,
    employmentStatus: "employed",
    employer: "Verify LLC",
    occupation: "Tester",
    annualIncome: "85000",
    sourceOfFunds: "employment",
    onlineId: `verify${tag}${ts}`.slice(0, 24),
    password: "VerifyPass123!",
    confirmPassword: "VerifyPass123!",
    idType: "passport",
    idNumber: `P${ts}`,
    idExpiry: "2031-12-31",
    idState: "",
    idFrontName: "id.png",
    idFrontPreview: TINY_PNG,
    idBackName: "",
    idBackPreview: "",
    selfieName: "selfie.png",
    selfiePreview: TINY_PNG,
    termsAccepted: true,
    eSignConsent: true,
    patriotActConsent: true,
    referralCode: "",
  };
}

const CASES: CaseDef[] = [
  {
    label: "Savings",
    endpoint: "/api/auth/signup",
    buildPayload: (tag) => individualBase(tag, "savings"),
    expect: { profileType: "individual", accountType: "savings", investmentPlanId: null },
  },
  {
    label: "FD Promo",
    endpoint: "/api/auth/signup",
    buildPayload: (tag) => individualBase(tag, "fixed_deposit", "july-promo-fd"),
    expect: {
      profileType: "individual",
      accountType: "fixed_deposit",
      investmentPlanId: "july-promo-fd",
    },
  },
  ...INVESTMENT_PLANS.map((plan) => ({
    label: `Investment / ${plan}`,
    endpoint: "/api/auth/signup",
    buildPayload: (tag: string) => individualBase(tag, "investment", plan),
    expect: {
      profileType: "individual",
      accountType: "investment",
      investmentPlanId: plan,
    },
  })),
  {
    label: "Nonprofit",
    endpoint: "/api/auth/signup/nonprofit",
    buildPayload: (tag) => {
      const ts = Date.now();
      return {
        organizationLegalName: `Verify Org ${tag} ${ts}`,
        dbaName: "",
        ein: "12-3456789",
        organizationType: "501c3",
        yearEstablished: "2010",
        missionStatement: "Testing nonprofit signup persistence for AWS Vision verification.",
        website: "https://example.org",
        expectedFundCapital: "150000",
        repFirstName: "Verify",
        repLastName: `NP${tag}`,
        repTitle: "Director",
        repEmail: `verify-np-${tag.toLowerCase()}-${ts}@awsvision-test.invalid`,
        repPhone: "+1 (555) 333-4444",
        addressLine1: "200 Charity Blvd",
        addressLine2: "",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "United States",
        onlineId: `verifynp${tag}${ts}`.slice(0, 24),
        password: "VerifyPass123!",
        confirmPassword: "VerifyPass123!",
        taxExemptDocName: "501c3.pdf",
        taxExemptDocPreview: TINY_PNG,
        bylawsOrAuthDocName: "bylaws.pdf",
        bylawsOrAuthDocPreview: TINY_PNG,
        termsAccepted: true,
        eSignConsent: true,
        patriotActConsent: true,
      };
    },
    expect: { profileType: "nonprofit", accountType: "nonprofit_fund", hasNonprofit: true },
  },
];

const dbPassword = fs.readFileSync(".cpanel-db-pass.txt", "utf8").trim();
const db = new Client({
  host: "bore.pub",
  port: 35542,
  user: "awsvision_webappuser",
  password: dbPassword,
  database: "awsvision_webapp",
  ssl: false,
});

interface TestResult {
  label: string;
  apiOk: boolean;
  apiStatus: number;
  apiError?: string;
  userId?: string;
  email?: string;
  dbUser?: boolean;
  dbAccount?: boolean;
  dbAccountMatch?: boolean;
  dbSignupLog?: boolean;
  dbNonprofit?: boolean;
  details?: string;
}

async function verifyInDb(
  email: string,
  expect: CaseDef["expect"]
): Promise<{
  userId: string | null;
  dbUser: boolean;
  dbAccount: boolean;
  dbAccountMatch: boolean;
  dbSignupLog: boolean;
  dbNonprofit: boolean;
  details: string;
}> {
  const userRes = await db.query(
    `SELECT u.id, u."profileType", u."kycStatus", u.email
     FROM "User" u WHERE LOWER(u.email) = LOWER($1)`,
    [email]
  );
  if (!userRes.rows.length) {
    return {
      userId: null,
      dbUser: false,
      dbAccount: false,
      dbAccountMatch: false,
      dbSignupLog: false,
      dbNonprofit: false,
      details: "User row missing",
    };
  }
  const user = userRes.rows[0];

  const acctRes = await db.query(
    `SELECT type, "investmentPlanId", principal, status FROM "PortfolioAccount" WHERE "userId" = $1`,
    [user.id]
  );
  const account = acctRes.rows[0];
  const dbAccount = !!account;

  let dbAccountMatch = false;
  if (account && expect.accountType) {
    const typeOk = account.type === expect.accountType;
    const planOk =
      expect.investmentPlanId === undefined
        ? true
        : expect.investmentPlanId === null
          ? account.investmentPlanId == null
          : account.investmentPlanId === expect.investmentPlanId;
    dbAccountMatch = typeOk && planOk;
  } else if (account && !expect.accountType) {
    dbAccountMatch = true;
  }

  const logRes = await db.query(
    `SELECT status FROM "SignupAttemptLog"
     WHERE LOWER(email) = LOWER($1) AND status = 'success'
     ORDER BY "createdAt" DESC LIMIT 1`,
    [email]
  );
  const dbSignupLog = logRes.rows.length > 0;

  let dbNonprofit = !expect.hasNonprofit;
  if (expect.hasNonprofit) {
    const np = await db.query(`SELECT id FROM "NonprofitProfile" WHERE "userId" = $1`, [user.id]);
    dbNonprofit = np.rows.length > 0;
  }

  const profileOk = user.profileType === expect.profileType;
  const details = [
    `user=${user.id.slice(0, 12)}…`,
    `profileType=${user.profileType}${profileOk ? "" : ` (expected ${expect.profileType})`}`,
    `kyc=${user.kycStatus}`,
    account
      ? `account type=${account.type} plan=${account.investmentPlanId ?? "null"} status=${account.status}`
      : "no account",
    `signupLog=${dbSignupLog ? "success" : "missing"}`,
    expect.hasNonprofit ? `nonprofitProfile=${dbNonprofit}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    userId: user.id,
    dbUser: profileOk,
    dbAccount,
    dbAccountMatch: dbAccountMatch && profileOk,
    dbSignupLog,
    dbNonprofit,
    details,
  };
}

async function runCase(c: CaseDef): Promise<TestResult> {
  const tag = c.label.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
  const payload = c.buildPayload(tag);
  const email =
    "email" in payload
      ? (payload as { email: string }).email
      : (payload as { repEmail: string }).repEmail;

  const res = await fetch(`${BASE}${c.endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string; user?: { id: string } };

  if (!res.ok) {
    return {
      label: c.label,
      apiOk: false,
      apiStatus: res.status,
      apiError: body.error ?? res.statusText,
      email,
    };
  }

  const dbCheck = await verifyInDb(email, c.expect);
  const allOk =
    dbCheck.dbUser && dbCheck.dbAccount && dbCheck.dbAccountMatch && dbCheck.dbSignupLog && dbCheck.dbNonprofit;

  return {
    label: c.label,
    apiOk: true,
    apiStatus: res.status,
    userId: body.user?.id ?? dbCheck.userId ?? undefined,
    email,
    dbUser: dbCheck.dbUser,
    dbAccount: dbCheck.dbAccount,
    dbAccountMatch: dbCheck.dbAccountMatch,
    dbSignupLog: dbCheck.dbSignupLog,
    dbNonprofit: dbCheck.dbNonprofit,
    details: dbCheck.details,
  };
}

async function cleanup() {
  const del = await db.query(
    `DELETE FROM "User" WHERE email LIKE '%@awsvision-test.invalid' RETURNING email`
  );
  if (del.rows.length) {
    console.log(`\nCleaned up ${del.rows.length} test user(s).`);
  }
}

function printResults(results: TestResult[]) {
  console.log("\n" + "=".repeat(72));
  console.log("SIGNUP VERIFICATION REPORT — awsvision.com → cPanel DB");
  console.log("=".repeat(72));

  let passed = 0;
  let failed = 0;

  for (const r of results) {
    const ok =
      r.apiOk &&
      r.dbUser &&
      r.dbAccount &&
      r.dbAccountMatch &&
      r.dbSignupLog &&
      r.dbNonprofit !== false;

    if (ok) passed++;
    else failed++;

    const icon = ok ? "PASS" : "FAIL";
    console.log(`\n[${icon}] ${r.label}`);
    console.log(`  API: ${r.apiStatus}${r.apiError ? ` — ${r.apiError}` : ""}`);
    if (r.details) console.log(`  DB:  ${r.details}`);
    if (!ok) {
      const issues: string[] = [];
      if (!r.apiOk) issues.push("API failed");
      if (!r.dbUser) issues.push("user/profileType");
      if (!r.dbAccount) issues.push("account missing");
      if (!r.dbAccountMatch) issues.push("account type/plan mismatch");
      if (!r.dbSignupLog) issues.push("signup log missing");
      if (r.dbNonprofit === false) issues.push("nonprofit profile missing");
      console.log(`  Issues: ${issues.join(", ")}`);
    }
  }

  console.log("\n" + "-".repeat(72));
  console.log(`TOTAL: ${passed} passed, ${failed} failed out of ${results.length}`);
  console.log("-".repeat(72));

  return failed === 0;
}

async function main() {
  await db.connect();
  console.log("Connected to cPanel DB via bore tunnel.");
  console.log(`Running ${CASES.length} signup scenarios on ${BASE}...\n`);

  const results: TestResult[] = [];
  for (const c of CASES) {
    process.stdout.write(`Testing ${c.label}… `);
    const r = await runCase(c);
    results.push(r);
    const ok =
      r.apiOk && r.dbUser && r.dbAccount && r.dbAccountMatch && r.dbSignupLog && r.dbNonprofit !== false;
    console.log(ok ? "OK" : "FAILED");
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  const allPassed = printResults(results);
  await cleanup();
  await db.end();
  process.exit(allPassed ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  try {
    await cleanup();
    await db.end();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
