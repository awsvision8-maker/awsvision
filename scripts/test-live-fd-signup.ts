/** Test FD promo signup when promo expired */
const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const email = `test-fd-${Date.now()}@awsvision-test.invalid`;

const payload = {
  accountType: "fixed_deposit",
  investmentPlanId: "july-promo-fd",
  firstName: "Test",
  middleName: "",
  lastName: "FdPromo",
  suffix: "",
  dateOfBirth: "1990-01-15",
  ssn: "123-45-6790",
  email,
  phone: "+1 (555) 000-0002",
  citizenship: "US",
  countryOfBirth: "United States",
  addressLine1: "123 Test St",
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
  onlineId: `fdtest${Date.now()}`,
  password: "TestPass123!",
  confirmPassword: "TestPass123!",
  idType: "passport",
  idNumber: "P1234568",
  idExpiry: "2030-01-01",
  idFrontName: "passport.png",
  idFrontPreview: TINY_PNG,
  selfieName: "selfie.png",
  selfiePreview: TINY_PNG,
  termsAccepted: true,
  eSignConsent: true,
  patriotActConsent: true,
};

async function main() {
  const res = await fetch("https://awsvision.com/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}

main();
