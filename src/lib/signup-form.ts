import type { SignupApplication } from "@/types";
import { getInvestmentPlan } from "@/lib/investment-plans";

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

export function validateSignupStep(step: number, form: SignupApplication): string | null {
  switch (step) {
    case 0: {
      if (!form.firstName.trim()) return "First name is required";
      if (!form.lastName.trim()) return "Last name is required";
      if (!form.dateOfBirth) return "Date of birth is required";
      const dob = new Date(form.dateOfBirth);
      const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) return "You must be at least 18 years old to open an account";
      if (form.ssn.replace(/\D/g, "").length !== 9) return "Enter a valid 9-digit Social Security Number";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        return "Enter a valid email address";
      if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
        return "Enter a valid phone number";
      if (!form.citizenship) return "Citizenship is required";
      if (form.accountType === "investment" && !form.investmentPlanId)
        return "Please select an investment plan (Silver, Gold, Diamond, etc.)";
      return null;
    }
    case 1: {
      if (!form.addressLine1.trim()) return "Street address is required";
      if (!form.city.trim()) return "City is required";
      if (!form.state.trim()) return "State is required";
      if (!form.postalCode.trim()) return "ZIP / postal code is required";
      if (!form.country.trim()) return "Country is required";
      if (!form.mailingSameAsHome) {
        if (!form.mailingAddressLine1.trim()) return "Mailing street address is required";
        if (!form.mailingCity.trim()) return "Mailing city is required";
        if (!form.mailingState.trim()) return "Mailing state is required";
        if (!form.mailingPostalCode.trim()) return "Mailing ZIP / postal code is required";
      }
      return null;
    }
    case 2: {
      if (!form.employmentStatus) return "Employment status is required";
      if (form.employmentStatus === "employed" && !form.employer.trim())
        return "Employer name is required";
      if (!form.occupation.trim()) return "Occupation is required";
      if (!form.annualIncome) return "Annual income is required";
      if (!form.sourceOfFunds) return "Source of funds is required";
      return null;
    }
    case 3: {
      if (!form.onlineId.trim() || form.onlineId.length < 4)
        return "Online ID must be at least 4 characters";
      if (form.password.length < 8) return "Passcode must be at least 8 characters";
      if (form.password !== form.confirmPassword) return "Passcodes do not match";
      return null;
    }
    case 4: {
      if (!form.idNumber.trim()) return "Document number is required";
      if (!form.idExpiry) return "Document expiration date is required";
      if (form.idType === "drivers_license" && !form.idState.trim())
        return "Issuing state is required for driver's license";
      if (!form.idFrontPreview) return "Upload the front of your ID document";
      if (form.idType === "drivers_license" && !form.idBackPreview)
        return "Upload the back of your driver's license";
      return null;
    }
    case 5: {
      if (!form.selfiePreview) return "Take or upload a selfie to verify your identity";
      return null;
    }
    case 6: {
      if (!form.termsAccepted) return "You must accept the Terms and Conditions";
      if (!form.eSignConsent) return "Electronic signature consent is required";
      if (!form.patriotActConsent) return "USA PATRIOT Act certification is required";
      return null;
    }
    default:
      return null;
  }
}
