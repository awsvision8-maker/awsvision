import type { NonprofitSignupApplication } from "@/types";
import {
  NONPROFIT_MIN_CAPITAL,
  NONPROFIT_MAX_CAPITAL,
  getNonprofitMonthlyRate,
} from "@/lib/nonprofit-program";

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
): string | null {
  switch (step) {
    case 0: {
      if (!form.organizationLegalName.trim()) return "Organization legal name is required";
      if (form.ein.replace(/\D/g, "").length !== 9) return "Enter a valid 9-digit EIN";
      if (!form.organizationType) return "Organization type is required";
      if (!form.yearEstablished.trim()) return "Year established is required";
      if (!form.missionStatement.trim() || form.missionStatement.length < 20)
        return "Provide a brief mission statement (at least 20 characters)";
      const capital = Number(form.expectedFundCapital);
      if (!capital || capital < NONPROFIT_MIN_CAPITAL || capital > NONPROFIT_MAX_CAPITAL)
        return `Fund capital must be between $${NONPROFIT_MIN_CAPITAL.toLocaleString()} and $${NONPROFIT_MAX_CAPITAL.toLocaleString()}`;
      return null;
    }
    case 1: {
      if (!form.repFirstName.trim()) return "Representative first name is required";
      if (!form.repLastName.trim()) return "Representative last name is required";
      if (!form.repTitle.trim()) return "Representative title is required";
      if (!form.repEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.repEmail))
        return "Enter a valid organization email";
      if (!form.repPhone.trim() || form.repPhone.replace(/\D/g, "").length < 10)
        return "Enter a valid organization phone number";
      return null;
    }
    case 2: {
      if (!form.addressLine1.trim()) return "Organization street address is required";
      if (!form.city.trim()) return "City is required";
      if (!form.state.trim()) return "State is required";
      if (!form.postalCode.trim()) return "ZIP / postal code is required";
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
      if (!form.taxExemptDocPreview) return "Upload your IRS tax-exempt determination letter or 501(c) status document";
      return null;
    }
    case 5: {
      if (!form.termsAccepted) return "You must accept the Terms and Conditions";
      if (!form.eSignConsent) return "Electronic signature consent is required";
      if (!form.patriotActConsent) return "Authorized representative certification is required";
      return null;
    }
    default:
      return null;
  }
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
