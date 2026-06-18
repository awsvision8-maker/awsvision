export const REGISTERED_OFFICE = {
  line1: "16192 Coastal Highway",
  city: "Lewes",
  state: "Delaware",
  zip: "19958",
  country: "United States",
  full: "16192 Coastal Highway, Lewes, Delaware 19958",
} as const;

export const MARYLAND_HEADQUARTERS = {
  line1: "2 Village Green Court",
  city: "Germantown",
  state: "Maryland",
  zip: "20876",
  country: "United States",
  full: "2 Village Green Court, Germantown, MD 20876",
} as const;

/** Both U.S. headquarters locations */
export const US_HEADQUARTERS = [REGISTERED_OFFICE, MARYLAND_HEADQUARTERS] as const;

export function formatUsHeadquarters() {
  return US_HEADQUARTERS.map((a) => `${a.full}, ${a.country}`).join("; ");
}

export const SITE_PHONES = [
  { display: "+1 (469) 754-2201", tel: "+14697542201" },
  { display: "(240) 780-6910", tel: "+12407806910" },
] as const;

export function formatSitePhones(separator = " · ") {
  return SITE_PHONES.map((p) => p.display).join(separator);
}

export function formatSitePhonesMultiline() {
  return SITE_PHONES.map((p) => p.display).join("\n");
}

export const SITE = {
  name: "AWS Vision",
  domain: "awsvision.com",
  url: "https://awsvision.com",
  tagline: "Quantitative Fintech-Driven Algorithmic Asset Management",
  phone: SITE_PHONES[0].display,
  phoneDisplay: SITE_PHONES[0].tel,
  phoneSecondary: SITE_PHONES[1].display,
  phoneSecondaryDisplay: SITE_PHONES[1].tel,
  phones: SITE_PHONES,
  email: "support@awsvision.com",
  /** Primary registered office (Delaware) */
  address: REGISTERED_OFFICE,
  headquarters: US_HEADQUARTERS,
  licenses: "Licensed and regulated in the United States and UAE",
  supportHours: "Mon–Fri 9:00 AM – 6:00 PM ET",
};

export const OFFICES = [
  {
    name: "Registered Office (Delaware)",
    address: `${SITE.address.full}, United States`,
    phone: SITE_PHONES[0].display,
    phoneDisplay: SITE_PHONES[0].tel,
    email: SITE.email,
    hours: "Mon–Fri 9:00 AM – 6:00 PM ET",
    note: "Registered office — AWS Vision is licensed in the U.S. and UAE.",
  },
  {
    name: "Headquarters (Maryland)",
    address: `${MARYLAND_HEADQUARTERS.full}, United States`,
    phone: SITE_PHONES[1].display,
    phoneDisplay: SITE_PHONES[1].tel,
    email: SITE.email,
    hours: "Mon–Fri 9:00 AM – 6:00 PM ET",
    note: "U.S. corporate headquarters.",
  },
];

export const BRANCHES = OFFICES.map((office) => ({
  city: office.name,
  address: office.address,
  phone: office.phone,
  hours: office.hours,
}));
