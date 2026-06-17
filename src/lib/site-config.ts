export const SITE = {
  name: "AWS Vision",
  domain: "awsvision.com",
  url: "https://awsvision.com",
  tagline: "Quantitative Fintech-Driven Algorithmic Asset Management",
  phone: "+1 (469) 754-2201",
  phoneDisplay: "+14697542201",
  email: "support@awsvision.com",
  address: {
    line1: "16192 Coastal Highway",
    city: "Lewes",
    state: "Delaware",
    zip: "19958",
    country: "United States",
    full: "16192 Coastal Highway, Lewes, Delaware 19958",
  },
  licenses: "Licensed and regulated in the United States and UAE",
  supportHours: "Mon–Fri 9:00 AM – 6:00 PM ET",
};

export const OFFICES = [
  {
    name: "Headquarters (United States)",
    address: SITE.address.full,
    phone: SITE.phone,
    email: SITE.email,
    hours: "Mon–Fri 9:00 AM – 6:00 PM ET",
    note: "Registered office — AWS Vision is licensed in the U.S. and UAE.",
  },
  {
    name: "Middle East Operations (UAE)",
    address: "Licensed operations — contact us for regional inquiries",
    phone: SITE.phone,
    email: SITE.email,
    hours: "Sun–Thu 9:00 AM – 5:00 PM GST",
    note: "Serving institutional and high-net-worth clients across the GCC.",
  },
];

export const BRANCHES = OFFICES.map((office) => ({
  city: office.name,
  address: office.address,
  phone: office.phone,
  hours: office.hours,
}));
