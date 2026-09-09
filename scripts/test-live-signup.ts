/** Test production signup API (savings account, minimal valid payload). */
const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const email = `test-signup-${Date.now()}@awsvision-test.invalid`;

const payload = {
  accountType: "savings",
  investmentPlanId: "",
  firstName: "Test",
  middleName: "",
  lastName: "Signup",
  suffix: "",
  dateOfBirth: "1990-01-15",
  ssn: "123-45-6789",
  email,
  phone: "+1 (555) 000-0001",
  citizenship: "US",
  countryOfBirth: "United States",
  addressLine1: "123 Test St",
  addressLine2: "",
  city: "Miami",
  state: "FL",
  postalCode: "33101",
  country: "United States",
  mailingSameAsHome: true,
  employmentStatus: "employed",
  employer: "Test Co",
  occupation: "Tester",
  annualIncome: "75000",
  sourceOfFunds: "employment",
  onlineId: `testuser${Date.now()}`,
  password: "TestPass123!",
  confirmPassword: "TestPass123!",
  idType: "passport",
  idNumber: "P1234567",
  idExpiry: "2030-01-01",
  idState: "",
  idFrontName: "passport.png",
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

async function main() {
  const res = await fetch("https://awsvision.com/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text.slice(0, 500));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
