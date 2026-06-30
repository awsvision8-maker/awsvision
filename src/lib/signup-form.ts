import type { SignupApplication } from "@/types";
import { getInvestmentPlan } from "@/lib/investment-plans";
import { MAX_OUTPUT_BYTES, MAX_SOURCE_FILE_MB } from "@/lib/compress-image";

export const MAX_IMAGE_FILE_MB = MAX_SOURCE_FILE_MB;
export const MAX_IMAGE_PREVIEW_BYTES = MAX_OUTPUT_BYTES + 50_000;
export const MAX_SIGNUP_IMAGES_TOTAL_BYTES = 3_200_000;

export const SIGNUP_STEPS = [
  { id: "personal", label: "Personal Info", shortLabel: "Personal" },
  { id: "address", label: "Home Address", shortLabel: "Address" },
  { id: "employment", label: "Employment & Income", shortLabel: "Employment" },
  { id: "credentials", label: "Online Banking", shortLabel: "Banking" },
  { id: "identity", label: "Identity Documents", shortLabel: "ID Docs" },
  { id: "selfie", label: "Selfie Verification", shortLabel: "Selfie" },
  { id: "review", label: "Review & Submit", shortLabel: "Review" },
] as const;

export const INITIAL_SIGNUP_FORM: SignupApplication = {
  accountType: "investment",
  investmentPlanId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  dateOfBirth: "",
  ssn: "",
  email: "",
  phone: "",
  citizenship: "US",
  countryOfBirth: "United States",

  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  mailingSameAsHome: true,
  mailingAddressLine1: "",
  mailingAddressLine2: "",
  mailingCity: "",
  mailingState: "",
  mailingPostalCode: "",
  mailingCountry: "United States",

  employmentStatus: "employed",
  employer: "",
  occupation: "",
  annualIncome: "",
  sourceOfFunds: "employment",

  onlineId: "",
  password: "",
  confirmPassword: "",

  idType: "drivers_license",
  idNumber: "",
  idExpiry: "",
  idState: "",
  idFrontName: "",
  idFrontPreview: "",
  idBackName: "",
  idBackPreview: "",

  selfieName: "",
  selfiePreview: "",

  termsAccepted: false,
  eSignConsent: false,
  patriotActConsent: false,
  referralCode: "",
};

export function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function maskSSN(ssn: string): string {
  const digits = ssn.replace(/\D/g, "");
  if (digits.length < 4) return ssn;
  return `***-**-${digits.slice(-4)}`;
}

function approxBase64Bytes(dataUrl: string) {
  const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1]! : dataUrl;
  return Math.ceil((base64.length * 3) / 4);
}

export function validateImagePreview(preview: string | undefined, label: string): string | null {
  if (!preview?.trim()) return `${label} is required`;
  if (!preview.startsWith("data:image/")) return `${label} is invalid — please upload again`;
  const bytes = approxBase64Bytes(preview);
  if (bytes > MAX_IMAGE_PREVIEW_BYTES) {
    return `${label} is too large (${Math.round(bytes / 1024)}KB). Upload a smaller photo.`;
  }
  return null;
}

function validateSignupImages(form: SignupApplication): string[] {
  const errors: string[] = [];
  const frontLabel =
    form.idType === "passport" ? "Passport photo page" : "Driver's license front";
  const frontErr = validateImagePreview(form.idFrontPreview, frontLabel);
  if (frontErr) errors.push(frontErr);

  if (form.idType === "drivers_license") {
    const backErr = validateImagePreview(form.idBackPreview, "Driver's license back");
    if (backErr) errors.push(backErr);
  }

  const selfieErr = validateImagePreview(form.selfiePreview, "Selfie verification photo");
  if (selfieErr) errors.push(selfieErr);

  const total =
    approxBase64Bytes(form.idFrontPreview || "") +
    approxBase64Bytes(form.idBackPreview || "") +
    approxBase64Bytes(form.selfiePreview || "");
  if (total > MAX_SIGNUP_IMAGES_TOTAL_BYTES) {
    errors.push(
      "Your uploaded documents are too large combined. Remove photos and upload smaller images."
    );
  }

  return errors;
}

export function validateSignupStep(step: number, form: SignupApplication): string[] {
  const errors: string[] = [];

  switch (step) {
    case 0: {
      if (!form.firstName.trim()) errors.push("First name is required");
      if (!form.lastName.trim()) errors.push("Last name is required");
      if (!form.dateOfBirth) errors.push("Date of birth is required");
      else {
        const dob = new Date(form.dateOfBirth);
        if (Number.isNaN(dob.getTime())) errors.push("Enter a valid date of birth");
        else {
          const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
          if (age < 18) errors.push("You must be at least 18 years old to open an account");
        }
      }
      if (form.ssn.replace(/\D/g, "").length !== 9) errors.push("Enter a valid 9-digit Social Security Number");
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errors.push("Enter a valid email address");
      if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
        errors.push("Enter a valid phone number (at least 10 digits)");
      if (!form.citizenship) errors.push("Citizenship is required");
      if (!form.countryOfBirth.trim()) errors.push("Country of birth is required");
      if (form.accountType === "investment" && !form.investmentPlanId)
        errors.push("Please select an investment plan (Silver, Gold, Diamond, etc.)");
      break;
    }
    case 1: {
      if (!form.addressLine1.trim()) errors.push("Street address is required");
      if (!form.city.trim()) errors.push("City is required");
      if (!form.state.trim()) errors.push("State is required");
      if (!form.postalCode.trim()) errors.push("ZIP / postal code is required");
      else if (!/^\d{5}(-\d{4})?$/.test(form.postalCode.trim()))
        errors.push("Enter a valid ZIP code (e.g. 75001 or 75001-1234)");
      if (!form.country.trim()) errors.push("Country is required");
      if (!form.mailingSameAsHome) {
        if (!form.mailingAddressLine1.trim()) errors.push("Mailing street address is required");
        if (!form.mailingCity.trim()) errors.push("Mailing city is required");
        if (!form.mailingState.trim()) errors.push("Mailing state is required");
        if (!form.mailingPostalCode.trim()) errors.push("Mailing ZIP / postal code is required");
      }
      break;
    }
    case 2: {
      if (!form.employmentStatus) errors.push("Employment status is required");
      if (
        (form.employmentStatus === "employed" || form.employmentStatus === "self_employed") &&
        !form.employer.trim()
      ) {
        errors.push("Employer / business name is required");
      }
      if (!form.occupation.trim()) errors.push("Occupation is required");
      if (!form.annualIncome) errors.push("Annual income is required");
      if (!form.sourceOfFunds) errors.push("Source of funds is required");
      break;
    }
    case 3: {
      if (!form.onlineId.trim() || form.onlineId.length < 4)
        errors.push("Online ID must be at least 4 characters");
      else if (form.onlineId.length > 32)
        errors.push("Online ID must be 32 characters or fewer");
      else if (!/^[a-zA-Z0-9._-]+$/.test(form.onlineId))
        errors.push("Online ID may only contain letters, numbers, dots, dashes, and underscores");
      if (form.password.length < 8) errors.push("Passcode must be at least 8 characters");
      if (form.password !== form.confirmPassword) errors.push("Passcodes do not match");
      break;
    }
    case 4: {
      if (!form.idNumber.trim()) errors.push("Document number is required");
      if (!form.idExpiry) errors.push("Document expiration date is required");
      else {
        const expiry = new Date(form.idExpiry);
        if (Number.isNaN(expiry.getTime())) errors.push("Enter a valid document expiration date");
        else if (expiry < new Date()) errors.push("Your ID document appears expired — upload a valid document");
      }
      if (form.idType === "drivers_license" && !form.idState.trim())
        errors.push("Issuing state is required for driver's license");
      errors.push(...validateSignupImages(form).filter((e) => !e.includes("Selfie")));
      break;
    }
    case 5: {
      const selfieErr = validateImagePreview(form.selfiePreview, "Selfie verification photo");
      if (selfieErr) errors.push(selfieErr);
      break;
    }
    case 6: {
      errors.push(...validateSignupStep(0, form));
      errors.push(...validateSignupStep(1, form));
      errors.push(...validateSignupStep(2, form));
      errors.push(...validateSignupStep(3, form));
      errors.push(...validateSignupStep(4, form));
      errors.push(...validateSignupStep(5, form));
      if (!form.termsAccepted) errors.push("You must accept the Terms and Conditions");
      if (!form.eSignConsent) errors.push("Electronic signature consent is required");
      if (!form.patriotActConsent) errors.push("USA PATRIOT Act certification is required");
      break;
    }
  }

  return [...new Set(errors)];
}
