type BuiltCity = {
  slug: string;
  name: string;
  metro: string;
  headline: string;
  intro: string;
  localFocus: string[];
  processSteps?: { title: string; body: string }[];
  whyLocal?: string[];
  keywords: string[];
  faqs: { q: string; a: string }[];
  light?: boolean;
};

type LightCitySeed = {
  slug: string;
  name: string;
  metro: string;
  /** Nearby places mentioned once for local uniqueness */
  nearby: string;
  /** Short regional hook (energy, border, campus, suburbs, etc.) */
  hook: string;
};

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Light but unique city landing — short copy, 2 FAQs, city/metro hooks.
 * Enough for indexing without doorway-page spam.
 */
export function buildLightTexasCity(seed: LightCitySeed): BuiltCity {
  const { slug, name, metro, nearby, hook } = seed;
  const v = hashSlug(slug) % 3;

  const headlines = [
    `Investment accounts & wealth plans for ${name}, TX`,
    `Online investment firm serving ${name}, Texas`,
    `Wealth management & savings for ${name}, TX`,
  ];
  const intros = [
    `AWS Vision Financial serves ${name} (${metro}) clients online — investment management, wealth plans, savings, and fixed deposits with remote KYC. ${hook} No ${name} retail branch required.`,
    `${name} residents open AWS Vision accounts online for portfolio tracking, wealth management, savings, and fixed deposits. ${hook} Statewide Texas service by portal and phone.`,
    `Looking for an investment firm near ${name}? AWS Vision is an online financial services firm covering ${metro} — remote onboarding, clear rates, and portal statements. ${hook}`,
  ];
  const focusSets = [
    [
      `${name} households comparing online investment firms vs storefront advisors`,
      `Professionals near ${nearby} who want wealth plans without a branch visit`,
      `Investors who want transparent rates before funding an account`,
    ],
    [
      `${name} families seeking savings, FD, or wealth options online`,
      `Clients across ${metro} who prefer remote KYC and digital statements`,
      `Households near ${nearby} comparing financial services without inventing a fake local office`,
    ],
    [
      `${name} investors who travel or work hybrid and need remote support`,
      `Residents near ${nearby} exploring portfolio management online`,
      `Clients who want phone + portal service covering ${metro}`,
    ],
  ];
  const whySets = [
    [
      `${name} “financial advisor near me” results often push retail offices. We serve ${name} honestly as part of statewide online Texas coverage — no invented storefront for Maps.`,
      `Compare /rates and /compare before you enroll, then complete KYC from ${name} or anywhere in ${metro}.`,
    ],
    [
      `${hook} Clients in ${name} and near ${nearby} often prefer digital onboarding that fits busy schedules.`,
      `We do not claim a public ${name} branch. Service is portal, phone (+1 469-754-2201), and email — the same model statewide.`,
    ],
    [
      `${name} sits in ${metro}. One online firm covering the region is clearer than fake local addresses.`,
      `Start with /serving-texas, review product pages, then apply at /signup when the fit is right.`,
    ],
  ];

  return {
    slug,
    name,
    metro,
    headline: headlines[v],
    intro: intros[v],
    localFocus: focusSets[v],
    processSteps: [
      {
        title: `Apply from ${name}`,
        body: `Complete signup and KYC online from ${name} or nearby ${nearby} — no in-person appointment required.`,
      },
      {
        title: "Choose savings, FD, or wealth",
        body: "Review published terms on the rates page, then pick the account type that matches your timeline.",
      },
      {
        title: "Fund and track in the portal",
        body: "After approval, fund your account and monitor balances and statements remotely. Phone: +1 (469) 754-2201.",
      },
    ],
    whyLocal: whySets[v],
    keywords: [
      `Investment Firm ${name}`,
      `Financial Advisor ${name} TX`,
      `Wealth Management ${name}`,
      `Investment Advisor ${name}`,
      `Financial Services ${name} Texas`,
      `Investment Management ${name} TX`,
    ],
    faqs: [
      {
        q: `Does AWS Vision serve ${name}, Texas?`,
        a: `Yes. ${name} and ${metro} clients open savings, fixed deposit, and wealth management accounts online with remote KYC.`,
      },
      {
        q: `Do you have an office in ${name}?`,
        a: `No public ${name} retail storefront. Clients are served remotely by portal, phone, and email as part of our Texas service-area model.`,
      },
    ],
    light: true,
  };
}

/** Additional Texas cities (major metros / high-search) — light unique pages */
export const TEXAS_LIGHT_CITY_SEEDS: LightCitySeed[] = [
  { slug: "irving", name: "Irving", metro: "Dallas–Fort Worth (DFW)", nearby: "Las Colinas and Grand Prairie", hook: "A major DFW employment hub with strong demand for remote financial onboarding." },
  { slug: "garland", name: "Garland", metro: "Dallas–Fort Worth (DFW)", nearby: "Richardson and Mesquite", hook: "East DFW households often want online wealth tools without a downtown Dallas branch trip." },
  { slug: "grand-prairie", name: "Grand Prairie", metro: "Dallas–Fort Worth (DFW)", nearby: "Arlington and Irving", hook: "Mid-cities DFW clients benefit from one statewide online firm between Dallas and Fort Worth." },
  { slug: "mesquite", name: "Mesquite", metro: "Dallas–Fort Worth (DFW)", nearby: "Garland and Balch Springs", hook: "East Dallas County residents frequently search for advisors but prefer remote KYC." },
  { slug: "carrollton", name: "Carrollton", metro: "Dallas–Fort Worth (DFW)", nearby: "Farmers Branch and Addison", hook: "North DFW professionals often choose digital statements over storefront visits." },
  { slug: "denton", name: "Denton", metro: "Dallas–Fort Worth (DFW) · Denton County", nearby: "Lewisville and Corinth", hook: "A growing North Texas city where campus and workforce schedules favor online enrollment." },
  { slug: "lewisville", name: "Lewisville", metro: "Dallas–Fort Worth (DFW)", nearby: "Flower Mound and Highland Village", hook: "Denton County suburbs commonly compare online investment firms across DFW." },
  { slug: "allen", name: "Allen", metro: "Dallas–Fort Worth (DFW) · Collin County", nearby: "McKinney and Plano", hook: "Collin County growth corridors search heavily for wealth management online." },
  { slug: "richardson", name: "Richardson", metro: "Dallas–Fort Worth (DFW)", nearby: "Plano and Garland", hook: "Telecom Corridor professionals often prefer fintech-style onboarding." },
  { slug: "flower-mound", name: "Flower Mound", metro: "Dallas–Fort Worth (DFW)", nearby: "Lewisville and Highland Village", hook: "Family-oriented North DFW suburbs value clear rates and remote support." },
  { slug: "mansfield", name: "Mansfield", metro: "Dallas–Fort Worth (DFW) · Tarrant County", nearby: "Arlington and Midlothian", hook: "South Tarrant growth areas often want portfolio tracking without a Fort Worth storefront." },
  { slug: "rowlett", name: "Rowlett", metro: "Dallas–Fort Worth (DFW)", nearby: "Rockwall and Garland", hook: "Northeast DFW lakeside communities search for online financial services statewide." },
  { slug: "north-richland-hills", name: "North Richland Hills", metro: "Dallas–Fort Worth (DFW) · Tarrant County", nearby: "Hurst and Bedford", hook: "Mid-cities Tarrant County households often prefer phone + portal service." },
  { slug: "euless", name: "Euless", metro: "Dallas–Fort Worth (DFW)", nearby: "Bedford and Grapevine", hook: "DFW Airport-area clients frequently need remote onboarding that travels with them." },
  { slug: "bedford", name: "Bedford", metro: "Dallas–Fort Worth (DFW) · Tarrant County", nearby: "Euless and Hurst", hook: "HEB mid-cities residents commonly compare online vs local advisors." },
  { slug: "grapevine", name: "Grapevine", metro: "Dallas–Fort Worth (DFW)", nearby: "Southlake and Colleyville", hook: "North Tarrant and airport-corridor clients often choose digital wealth portals." },
  { slug: "keller", name: "Keller", metro: "Dallas–Fort Worth (DFW) · Tarrant County", nearby: "Southlake and Fort Worth", hook: "North Tarrant suburbs search for wealth management with honest online delivery." },
  { slug: "southlake", name: "Southlake", metro: "Dallas–Fort Worth (DFW)", nearby: "Keller and Grapevine", hook: "Affluent North DFW households often evaluate online firms alongside local RIAs." },
  { slug: "wylie", name: "Wylie", metro: "Dallas–Fort Worth (DFW) · Collin County", nearby: "Sachse and Murphy", hook: "Fast-growing Collin County towns benefit from statewide remote KYC." },
  { slug: "rockwall", name: "Rockwall", metro: "Dallas–Fort Worth (DFW) · Rockwall County", nearby: "Rowlett and Royse City", hook: "East of Dallas, lake-community clients often prefer online enrollment." },
  { slug: "prosper", name: "Prosper", metro: "Dallas–Fort Worth (DFW) · Collin County", nearby: "Frisco and Celina", hook: "North Collin growth towns search heavily for investment and wealth keywords." },
  { slug: "cedar-hill", name: "Cedar Hill", metro: "Dallas–Fort Worth (DFW)", nearby: "DeSoto and Duncanville", hook: "Southwest Dallas County clients want clear remote financial service options." },
  { slug: "desoto", name: "DeSoto", metro: "Dallas–Fort Worth (DFW)", nearby: "Cedar Hill and Lancaster", hook: "Southern Dallas County households often compare online investment firms." },
  { slug: "waxahachie", name: "Waxahachie", metro: "Dallas–Fort Worth (DFW) · Ellis County", nearby: "Midlothian and Ennis", hook: "South of DFW, Ellis County clients deserve the same remote Texas coverage." },
  { slug: "weatherford", name: "Weatherford", metro: "Dallas–Fort Worth (DFW) · Parker County", nearby: "Aledo and Fort Worth", hook: "West of Fort Worth, Parker County residents often prefer phone-first support." },
  { slug: "cleburne", name: "Cleburne", metro: "Dallas–Fort Worth (DFW) · Johnson County", nearby: "Burleson and Joshua", hook: "South Tarrant / Johnson County towns search for online savings and wealth options." },

  { slug: "pasadena", name: "Pasadena", metro: "Greater Houston", nearby: "Deer Park and Houston", hook: "East Houston industrial corridor households often need flexible remote onboarding." },
  { slug: "pearland", name: "Pearland", metro: "Greater Houston", nearby: "Friendswood and Houston", hook: "South Houston suburbs frequently compare online wealth management." },
  { slug: "league-city", name: "League City", metro: "Greater Houston · Galveston County", nearby: "Clear Lake and Friendswood", hook: "Bay Area Houston clients often prefer digital accounts that travel with them." },
  { slug: "sugar-land", name: "Sugar Land", metro: "Greater Houston · Fort Bend County", nearby: "Missouri City and Stafford", hook: "Fort Bend professionals commonly evaluate online investment firms." },
  { slug: "missouri-city", name: "Missouri City", metro: "Greater Houston · Fort Bend County", nearby: "Sugar Land and Houston", hook: "Southwest Houston suburbs search for clear rates and remote KYC." },
  { slug: "baytown", name: "Baytown", metro: "Greater Houston", nearby: "Mont Belvieu and Houston", hook: "East Harris County energy-corridor clients benefit from statewide online service." },
  { slug: "conroe", name: "Conroe", metro: "Greater Houston · Montgomery County", nearby: "The Woodlands and Spring", hook: "North of Houston, Montgomery County growth favors remote financial onboarding." },
  { slug: "the-woodlands", name: "The Woodlands", metro: "Greater Houston · Montgomery County", nearby: "Spring and Conroe", hook: "Master-planned North Houston communities often research online wealth platforms." },
  { slug: "spring", name: "Spring", metro: "Greater Houston", nearby: "The Woodlands and Humble", hook: "North Harris County residents commonly want portal-based portfolio tracking." },
  { slug: "cypress", name: "Cypress", metro: "Greater Houston", nearby: "Katy and Tomball", hook: "Northwest Houston suburbs search heavily for financial advisor alternatives online." },
  { slug: "katy", name: "Katy", metro: "Greater Houston", nearby: "Cypress and Richmond", hook: "West Houston growth corridors often prefer remote KYC over branch visits." },
  { slug: "humble", name: "Humble", metro: "Greater Houston", nearby: "Kingwood and Atascocita", hook: "Northeast Houston clients benefit from phone + portal Texas coverage." },
  { slug: "friendswood", name: "Friendswood", metro: "Greater Houston", nearby: "Pearland and League City", hook: "South Houston family suburbs often compare savings and wealth options online." },
  { slug: "texas-city", name: "Texas City", metro: "Greater Houston · Galveston County", nearby: "La Marque and Galveston", hook: "Gulf Coast industrial communities need flexible remote financial services." },
  { slug: "galveston", name: "Galveston", metro: "Greater Houston · Galveston County", nearby: "Texas City and League City", hook: "Island and coastal residents often want accounts they can manage from anywhere in Texas." },
  { slug: "beaumont", name: "Beaumont", metro: "Beaumont–Port Arthur", nearby: "Port Arthur and Orange", hook: "Southeast Texas energy markets deserve the same online Texas coverage as major metros." },
  { slug: "port-arthur", name: "Port Arthur", metro: "Beaumont–Port Arthur", nearby: "Beaumont and Nederland", hook: "Golden Triangle clients can enroll remotely without inventing a local storefront." },

  { slug: "round-rock", name: "Round Rock", metro: "Austin metro · Williamson County", nearby: "Austin and Cedar Park", hook: "North Austin tech and corporate corridors often prefer digital wealth onboarding." },
  { slug: "cedar-park", name: "Cedar Park", metro: "Austin metro · Williamson County", nearby: "Round Rock and Leander", hook: "Northwest Austin suburbs search for online investment and savings options." },
  { slug: "georgetown", name: "Georgetown", metro: "Austin metro · Williamson County", nearby: "Round Rock and Liberty Hill", hook: "Williamson County growth towns commonly evaluate remote financial firms." },
  { slug: "pflugerville", name: "Pflugerville", metro: "Austin metro", nearby: "Round Rock and Austin", hook: "Northeast Austin households often want clear rates and portal statements." },
  { slug: "leander", name: "Leander", metro: "Austin metro · Williamson County", nearby: "Cedar Park and Georgetown", hook: "Northwest corridor families frequently compare online wealth management." },
  { slug: "san-marcos", name: "San Marcos", metro: "Austin–San Antonio corridor", nearby: "New Braunfels and Kyle", hook: "I-35 corridor cities benefit from one statewide online service model." },
  { slug: "new-braunfels", name: "New Braunfels", metro: "San Antonio–Austin corridor · Comal County", nearby: "San Marcos and Schertz", hook: "Hill Country–adjacent towns often prefer remote KYC over branch appointments." },
  { slug: "kyle", name: "Kyle", metro: "Austin metro · Hays County", nearby: "Buda and San Marcos", hook: "Hays County growth communities search for online investment accounts." },
  { slug: "buda", name: "Buda", metro: "Austin metro · Hays County", nearby: "Kyle and Austin", hook: "South Austin suburbs commonly research digital financial services." },

  { slug: "schertz", name: "Schertz", metro: "San Antonio metro", nearby: "Universal City and New Braunfels", hook: "Northeast San Antonio suburbs often want remote wealth and savings options." },
  { slug: "universal-city", name: "Universal City", metro: "San Antonio metro", nearby: "Schertz and Converse", hook: "Military-adjacent communities benefit from accounts manageable from anywhere." },
  { slug: "converse", name: "Converse", metro: "San Antonio metro", nearby: "Universal City and Live Oak", hook: "East Bexar County households search for online financial advisors serving Texas." },

  { slug: "corpus-christi", name: "Corpus Christi", metro: "Coastal Bend", nearby: "Portland and Robstown", hook: "Coastal Bend clients deserve statewide remote onboarding — we do not invent a local retail branch." },
  { slug: "laredo", name: "Laredo", metro: "Laredo metro · Webb County", nearby: "Rio Bravo and Nuevo Laredo trade corridor", hook: "Border-metro households often need flexible online enrollment and phone support." },
  { slug: "mcallen", name: "McAllen", metro: "Rio Grande Valley", nearby: "Edinburg and Mission", hook: "RGV professionals frequently compare online investment firms across South Texas." },
  { slug: "edinburg", name: "Edinburg", metro: "Rio Grande Valley · Hidalgo County", nearby: "McAllen and Pharr", hook: "Hidalgo County clients can complete KYC remotely under statewide Texas coverage." },
  { slug: "mission", name: "Mission", metro: "Rio Grande Valley", nearby: "McAllen and Palmview", hook: "West RGV communities often prefer portal-based savings and wealth tracking." },
  { slug: "brownsville", name: "Brownsville", metro: "Rio Grande Valley · Cameron County", nearby: "Harlingen and South Padre access routes", hook: "Cameron County residents benefit from honest online Texas service without fake storefronts." },
  { slug: "harlingen", name: "Harlingen", metro: "Rio Grande Valley · Cameron County", nearby: "Brownsville and Weslaco", hook: "Mid-Valley clients commonly enroll online for savings, FD, and wealth plans." },
  { slug: "pharr", name: "Pharr", metro: "Rio Grande Valley", nearby: "McAllen and San Juan", hook: "Central Hidalgo County households search for remote financial services." },

  { slug: "lubbock", name: "Lubbock", metro: "Lubbock metro · South Plains", nearby: "Wolfforth and Texas Tech area", hook: "South Plains clients get the same remote Texas coverage as major metros." },
  { slug: "amarillo", name: "Amarillo", metro: "Amarillo metro · Texas Panhandle", nearby: "Canyon and Potter–Randall area", hook: "Panhandle households deserve online enrollment without inventing a local office." },
  { slug: "midland", name: "Midland", metro: "Permian Basin", nearby: "Odessa and Midland County", hook: "Energy-corridor schedules often favor remote KYC and portal statements." },
  { slug: "odessa", name: "Odessa", metro: "Permian Basin · Ector County", nearby: "Midland and West Odessa", hook: "Permian Basin clients frequently need financial accounts they can manage while traveling." },
  { slug: "abilene", name: "Abilene", metro: "Abilene metro · Big Country", nearby: "Dyess AFB area and Taylor County", hook: "West-central Texas communities are served online statewide — no fake Abilene storefront." },
  { slug: "san-angelo", name: "San Angelo", metro: "San Angelo metro · Concho Valley", nearby: "Goodfellow AFB area", hook: "Concho Valley clients enroll remotely with the same Texas service model." },
  { slug: "wichita-falls", name: "Wichita Falls", metro: "Wichita Falls metro · North Texas", nearby: "Sheppard AFB area", hook: "North Texas / Red River communities benefit from phone + portal coverage." },
  { slug: "tyler", name: "Tyler", metro: "Tyler metro · East Texas", nearby: "Longview and Lindale", hook: "East Texas piney woods cities often research online wealth and savings options." },
  { slug: "longview", name: "Longview", metro: "Longview metro · East Texas", nearby: "Tyler and Kilgore", hook: "Gregg County clients can open accounts online under statewide Texas service." },
  { slug: "texarkana", name: "Texarkana", metro: "Texarkana metro · Northeast Texas", nearby: "Bowie County and the AR state line area", hook: "Northeast Texas border-metro clients use remote KYC — we serve the Texas side online." },
  { slug: "waco", name: "Waco", metro: "Waco metro · Central Texas", nearby: "Woodway and Hewitt", hook: "I-35 Central Texas households often prefer digital onboarding between DFW and Austin." },
  { slug: "killeen", name: "Killeen", metro: "Killeen–Temple · Fort Cavazos area", nearby: "Harker Heights and Copperas Cove", hook: "Military-community clients need accounts they can manage during moves and deployments." },
  { slug: "temple", name: "Temple", metro: "Killeen–Temple · Bell County", nearby: "Belton and Killeen", hook: "Central Texas medical-corridor cities commonly compare online investment firms." },
  { slug: "college-station", name: "College Station", metro: "Bryan–College Station", nearby: "Bryan and Texas A&M area", hook: "Brazos Valley campus and professional communities often choose remote financial platforms." },
  { slug: "bryan", name: "Bryan", metro: "Bryan–College Station", nearby: "College Station and Brazos County", hook: "Brazos Valley residents enroll online for savings, FD, and wealth plans." },
  { slug: "victoria", name: "Victoria", metro: "Victoria metro · Crossroads", nearby: "Port Lavaca access and surrounding counties", hook: "Coastal plains cities get honest statewide online coverage — no invented local branch." },
  { slug: "sherman", name: "Sherman", metro: "Sherman–Denison · Grayson County", nearby: "Denison and Van Alstyne", hook: "North of DFW, Grayson County clients use remote KYC under Texas service-area coverage." },
  { slug: "denison", name: "Denison", metro: "Sherman–Denison · Grayson County", nearby: "Sherman and Pottsboro", hook: "Red River / North Texas towns benefit from portal-based investment accounts." },
  { slug: "paris", name: "Paris", metro: "Northeast Texas · Lamar County", nearby: "Powderly and Reno area", hook: "Northeast Texas communities are included in statewide online service — not a retail storefront list." },
  { slug: "marshall", name: "Marshall", metro: "East Texas · Harrison County", nearby: "Longview and Jefferson", hook: "Deep East Texas clients can complete KYC remotely with phone support." },
  { slug: "nacogdoches", name: "Nacogdoches", metro: "East Texas · Deep East", nearby: "Lufkin and SFA area", hook: "Campus and piney woods communities often prefer online enrollment over branch visits." },
  { slug: "lufkin", name: "Lufkin", metro: "East Texas · Angelina County", nearby: "Nacogdoches and Diboll", hook: "Angelina County households search for remote savings and wealth options." },
  { slug: "del-rio", name: "Del Rio", metro: "Southwest Texas · Val Verde County", nearby: "Laughlin AFB area", hook: "Border and military-adjacent communities need flexible remote account access." },
  { slug: "eagle-pass", name: "Eagle Pass", metro: "Southwest Texas · Maverick County", nearby: "Border trade corridor", hook: "Southwest border towns are served online statewide — honest about no local retail branch." },
  { slug: "socorro", name: "Socorro", metro: "El Paso metro", nearby: "El Paso and Horizon City", hook: "Lower Valley El Paso communities enroll remotely under West Texas coverage." },
  { slug: "horizon-city", name: "Horizon City", metro: "El Paso metro", nearby: "Socorro and El Paso", hook: "East El Paso County growth areas benefit from portal-based financial services." },
];

export function getLightTexasCities(): BuiltCity[] {
  return TEXAS_LIGHT_CITY_SEEDS.map(buildLightTexasCity);
}
