export const KYC_DOCUMENT_KEYS = [
  "id_front",
  "id_back",
  "selfie",
  "tax_exempt",
] as const;

export type KycDocumentKey = (typeof KYC_DOCUMENT_KEYS)[number];

export interface KycDocumentFieldDef {
  key: KycDocumentKey;
  previewKey: string;
  nameKey: string;
  label: string;
  profileTypes: Array<"individual" | "nonprofit" | "all">;
}

export const KYC_DOCUMENT_FIELDS: KycDocumentFieldDef[] = [
  {
    key: "id_front",
    previewKey: "idFrontPreview",
    nameKey: "idFrontName",
    label: "ID — Front",
    profileTypes: ["individual"],
  },
  {
    key: "id_back",
    previewKey: "idBackPreview",
    nameKey: "idBackName",
    label: "ID — Back",
    profileTypes: ["individual"],
  },
  {
    key: "selfie",
    previewKey: "selfiePreview",
    nameKey: "selfieName",
    label: "Selfie Verification",
    profileTypes: ["individual"],
  },
  {
    key: "tax_exempt",
    previewKey: "taxExemptDocPreview",
    nameKey: "taxExemptDocName",
    label: "Tax-Exempt Determination Letter",
    profileTypes: ["nonprofit"],
  },
];

export function getKycDocumentDef(key: string): KycDocumentFieldDef | undefined {
  return KYC_DOCUMENT_FIELDS.find((d) => d.key === key);
}

export function documentsForProfileType(profileType: string): KycDocumentFieldDef[] {
  const type = profileType === "nonprofit" ? "nonprofit" : "individual";
  return KYC_DOCUMENT_FIELDS.filter(
    (d) => d.profileTypes.includes("all") || d.profileTypes.includes(type)
  );
}

export function isKycDocumentKey(value: string): value is KycDocumentKey {
  return (KYC_DOCUMENT_KEYS as readonly string[]).includes(value);
}
