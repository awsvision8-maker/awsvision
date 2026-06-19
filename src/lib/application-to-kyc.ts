import type { KYCData, SignupApplication } from "@/types";

export function applicationToKYC(data: SignupApplication): KYCData {
  return {
    dateOfBirth: data.dateOfBirth,
    nationality: data.citizenship,
    ssn: data.ssn,
    address:
      data.addressLine1 + (data.addressLine2 ? `, ${data.addressLine2}` : ""),
    city: data.city,
    state: data.state,
    country: data.country,
    postalCode: data.postalCode,
    idType: data.idType,
    idNumber: data.idNumber,
    idExpiry: data.idExpiry,
    occupation: data.occupation,
    sourceOfFunds: data.sourceOfFunds,
    employmentStatus: data.employmentStatus,
    employer: data.employer,
    annualIncome: data.annualIncome,
    idFrontName: data.idFrontName,
    idFrontPreview: data.idFrontPreview,
    idBackName: data.idBackName,
    idBackPreview: data.idBackPreview,
    selfieName: data.selfieName,
    selfiePreview: data.selfiePreview,
  };
}
