import type { NonprofitSignupApplication } from "@/types";
import {
  NONPROFIT_MIN_CAPITAL,
  NONPROFIT_MAX_CAPITAL,
  getNonprofitMonthlyRate,
} from "@/lib/nonprofit-program";
import { validateImagePreview } from "@/lib/signup-form";

export const NONPROFIT_SIGNUP_STEPS = [
  { id: "organization", label: "Organization", shortLabel: "Org" },
  { id: "representative", label: "Authorized Representative", shortLabel: "Rep" },
  { id: "address", label: "Organization Address", shortLabel: "Address" },
  { id: "credentials", label: "Portal Access", shortLabel: "Access" },
  { id: "documents", label: "Tax-Exempt Documents", shortLabel: "Docs" },
  { id: "review", label: "Review & Submit", shortLabel: "Review" },
] as const;

export const INITIAL_NONPROFIT_SIGNUP: NonprofitSignupApplication = {
  organizationLegalName: "",
  dbaName: "",
  ein: "",
  organizationType: "501c3",
  yearEstablished: "",
  missionStatement: "",
  website: "",
  expectedFundCapital: "100000",

  repFirstName: "",
  repLastName: "",
  repTitle: "",
  repEmail: "",
  repPhone: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",

  onlineId: "",
  password: "",
  confirmPassword: "",

  taxExemptDocName: "",
  taxExemptDocPreview: "",
  bylawsOrAuthDocName: "",
  bylawsOrAuthDocPreview: "",

  termsAccepted: false,
  eSignConsent: false,
  patriotActConsent: false,
};

export function formatEIN(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

export function validateNonprofitSignupStep(
  step: number,
  form: NonprofitSignupApplication
): string[] {
  const errors: string[] = [];

  switch (step) {
    case 0: {
      if (!form.organizationLegalName.trim()) errors.push("Organization legal name is required");
      if (form.ein.replace(/\D/g, "").length !== 9) errors.push("Enter a valid 9-digit EIN");
      if (!form.organizationType) errors.push("Organization type is required");
      if (!form.yearEstablished.trim()) errors.push("Year established is required");
      if (!form.missionStatement.trim() || form.missionStatement.length < 20)
        errors.push("Provide a brief mission statement (at least 20 characters)");
      const capital = Number(form.expectedFundCapital);
      if (!capital || capital < NONPROFIT_MIN_CAPITAL || capital > NONPROFIT_MAX_CAPITAL)
        errors.push(
          `Fund capital must be between $${NONPROFIT_MIN_CAPITAL.toLocaleString()} and $${NONPROFIT_MAX_CAPITAL.toLocaleString()}`
        );
      break;
    }
    case 1: {
      if (!form.repFirstName.trim()) errors.push("Representative first name is required");
      if (!form.repLastName.trim()) errors.push("Representative last name is required");
      if (!form.repTitle.trim()) errors.push("Representative title is required");
      if (!form.repEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.repEmail))
        errors.push("Enter a valid organization email");
      if (!form.repPhone.trim() || form.repPhone.replace(/\D/g, "").length < 10)
        errors.push("Enter a valid organization phone number");
      break;
    }
    case 2: {
      if (!form.addressLine1.trim()) errors.push("Organization street address is required");
      if (!form.city.trim()) errors.push("City is required");
      if (!form.state.trim()) errors.push("State is required");
      if (!form.postalCode.trim()) errors.push("ZIP / postal code is required");
      break;
    }
    case 3: {
      if (!form.onlineId.trim() || form.onlineId.replace(/\s/g, "").length < 4)
        errors.push("Online ID must be at least 4 characters");
      else if (form.onlineId.replace(/\s/g, "").length > 32)
        errors.push("Online ID must be 32 characters or fewer");
      else if (!/^[a-zA-Z0-9._-]+$/.test(form.onlineId.replace(/\s/g, "")))
        errors.push("Online ID may only contain letters, numbers, dots, dashes, and underscores");
      if (form.password.length < 8) errors.push("Passcode must be at least 8 characters");
      if (form.password !== form.confirmPassword) errors.push("Passcodes do not match");
      break;
    }
    case 4: {
      const taxErr = validateImagePreview(
        form.taxExemptDocPreview,
        "Tax-exempt determination letter"
      );
      if (taxErr) errors.push(taxErr);
      break;
    }
    case 5: {
      errors.push(...validateNonprofitSignupStep(0, form));
      errors.push(...validateNonprofitSignupStep(1, form));
      errors.push(...validateNonprofitSignupStep(2, form));
      errors.push(...validateNonprofitSignupStep(3, form));
      errors.push(...validateNonprofitSignupStep(4, form));
      if (!form.termsAccepted) errors.push("You must accept the Terms and Conditions");
      if (!form.eSignConsent) errors.push("Electronic signature consent is required");
      if (!form.patriotActConsent) errors.push("Authorized representative certification is required");
      break;
    }
  }

  return [...new Set(errors)];
}

export function nonprofitApplicationToProfile(form: NonprofitSignupApplication) {
  const fundCapital = Number(form.expectedFundCapital);
  const monthlyRate = getNonprofitMonthlyRate(fundCapital);
  return {
    organizationLegalName: form.organizationLegalName,
    dbaName: form.dbaName || undefined,
    ein: form.ein,
    organizationType: form.organizationType,
    yearEstablished: form.yearEstablished,
    missionStatement: form.missionStatement,
    website: form.website || undefined,
    fundCapital,
    monthlyRate,
    representativeName: `${form.repFirstName} ${form.repLastName}`,
    representativeTitle: form.repTitle,
  };
}
