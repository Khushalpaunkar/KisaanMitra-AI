require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Scheme = require("../Models/Scheme");

console.log("Connecting to MongoDB...");

const schemes = [
  // =========================================================
  // 1. PM-KISAN
  // =========================================================
  {
    name: "PM-KISAN",
    title: "Pradhan Mantri Kisan Samman Nidhi",
    slug: "pm-kisan",
    subtitle: "Direct income support for eligible farmer families",

    category: "Financial Support",
    government: "Central Government",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/pm-kisan.jpg",

    benefit:
      "Income support of ₹6,000 per year to eligible landholding farmer families, subject to the scheme guidelines and exclusions.",

    overview:
      "PM-KISAN is a Central Sector Scheme that provides direct income support to eligible landholding farmer families. Benefits are transferred directly to beneficiary bank accounts after eligibility verification.",

    eligibility: [
      "Farmer family must satisfy the current PM-KISAN eligibility criteria.",
      "Landholding and beneficiary records must match official government records.",
      "The beneficiary must not fall under the applicable exclusion categories.",
      "eKYC and other required verification should be completed as applicable."
    ],

    documents: [
      "Aadhaar details",
      "Bank account details",
      "Land ownership / land record details",
      "Mobile number",
      "Any additional document required by the official portal"
    ],

    applicationSteps: [
      "Visit the official PM-KISAN portal.",
      "Complete farmer registration if eligible.",
      "Complete Aadhaar authentication and eKYC as required.",
      "Verify land and bank details.",
      "Check beneficiary status and payment status on the official portal."
    ],

    officialUrl: "https://pmkisan.gov.in",
    applyUrl: "https://pmkisan.gov.in/RegistrationFormupdated.aspx",

    tags: [
      "financial support",
      "income support",
      "farmer family",
      "direct benefit transfer",
      "pm kisan"
    ],

    matching: {
      needs: ["financial", "support"],
      crops: ["all"],
      seasons: ["all"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["all"],
      landTypes: ["all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://pmkisan.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 2. PMFBY
  // =========================================================
  {
    name: "PMFBY",
    title: "Pradhan Mantri Fasal Bima Yojana",
    slug: "pmfby",
    subtitle: "Crop insurance support against notified crop risks",

    category: "Crop Insurance",
    government: "Central Government",
    state: "Maharashtra",
    status: "Seasonal",

    image: "/images/schemes/crop-insurance.jpg",

    benefit:
      "Crop insurance protection for notified crops and eligible farmers against covered crop losses and risks under PMFBY.",

    overview:
      "Pradhan Mantri Fasal Bima Yojana provides crop insurance coverage for notified crops and areas against specified risks. Crop, season, area and application conditions depend on the applicable notification.",

    eligibility: [
      "Farmer must satisfy the applicable PMFBY eligibility conditions.",
      "The crop must be notified for insurance in the applicable area and season.",
      "Crop and land/cultivation details must match the applicable records.",
      "Farmers should verify the current notification before applying."
    ],

    documents: [
      "Identity proof",
      "Bank account details",
      "Land records or cultivation details",
      "Crop details",
      "Required farmer registration details"
    ],

    applicationSteps: [
      "Check the current PMFBY crop and season notification.",
      "Confirm that the crop and area are covered.",
      "Apply through the authorised channel or official PMFBY process.",
      "Submit farmer, bank and crop details.",
      "Keep the acknowledgement and monitor policy/application status."
    ],

    officialUrl: "https://pmfby.gov.in",
    applyUrl: "https://pmfby.gov.in",

    tags: [
      "insurance",
      "crop insurance",
      "crop protection",
      "weather risk",
      "pmfby"
    ],

    matching: {
      needs: ["insurance"],
      crops: [
        "cotton",
        "soybean",
        "wheat",
        "sorghum",
        "tur",
        "pigeon pea",
        "rice",
        "gram",
        "chickpea",
        "all"
      ],
      seasons: ["kharif", "rabi", "summer"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["rainfed", "well", "borewell", "canal", "all"],
      landTypes: ["rainfed", "irrigated", "all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://pmfby.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 3. KISAN CREDIT CARD
  // =========================================================
  {
    name: "Kisan Credit Card",
    title: "Kisan Credit Card",
    slug: "kisan-credit-card",
    subtitle: "Agricultural credit and working capital facility",

    category: "Agricultural Credit",
    government: "Central Government",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/kcc.jpg",

    benefit:
      "Access to agricultural credit and working capital through participating banks and lending institutions, subject to applicable rules.",

    overview:
      "Kisan Credit Card provides eligible farmers access to timely agricultural credit for cultivation and related farming requirements. Final credit limits and sanction decisions are made by the participating lending institution according to applicable rules.",

    eligibility: [
      "Applicant must satisfy the participating bank's eligibility conditions.",
      "Valid farming, cultivation or land-related details may be required.",
      "Identity and banking details must be verified.",
      "Final credit sanction depends on the lending institution."
    ],

    documents: [
      "Identity proof",
      "Address proof",
      "Land records or cultivation proof",
      "Bank account details",
      "Additional documents requested by the bank"
    ],

    applicationSteps: [
      "Visit a participating bank or authorised lending institution.",
      "Ask for the Kisan Credit Card facility.",
      "Submit personal and farming details.",
      "Complete bank verification.",
      "Receive the approved credit facility if sanctioned."
    ],

    officialUrl: "https://www.rbi.org.in",
    applyUrl: "https://www.rbi.org.in",

    tags: [
      "loan",
      "credit",
      "agriculture finance",
      "working capital",
      "kcc"
    ],

    matching: {
      needs: ["loan", "financial"],
      crops: ["all"],
      seasons: ["kharif", "rabi", "summer"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["all"],
      landTypes: ["all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://www.rbi.org.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 4. PMKSY - MICRO IRRIGATION
  // =========================================================
  {
    name: "PMKSY - Micro Irrigation",
    title:
      "Pradhan Mantri Krishi Sinchayee Yojana - Per Drop More Crop",

    slug: "pmksy-micro-irrigation",

    subtitle:
      "Support for water-efficient drip and sprinkler irrigation systems",

    category: "Irrigation",
    government: "Government of India / Maharashtra Agriculture Department",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/irrigation.jpg",

    benefit:
      "Support for eligible micro-irrigation systems such as drip and sprinkler irrigation under applicable scheme guidelines.",

    overview:
      "The Per Drop More Crop component promotes efficient use of irrigation water through micro-irrigation systems. Maharashtra implements the agriculture department component through the MahaDBT farmer portal.",

    eligibility: [
      "Farmer must satisfy the current scheme eligibility conditions.",
      "The proposed irrigation system must be an eligible component.",
      "Land and farmer records must satisfy the applicable requirements.",
      "Final approval is subject to departmental verification and current guidelines."
    ],

    documents: [
      "Farmer identity proof",
      "Land records",
      "Bank account details",
      "Farmer registration / Farmer ID as applicable",
      "Quotation or system details where required"
    ],

    applicationSteps: [
      "Login or register on the MahaDBT Farmer Portal.",
      "Select the applicable micro-irrigation scheme/component.",
      "Check eligibility and required documents.",
      "Submit the application and required details.",
      "Complete verification and follow the official approval process."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "irrigation",
      "micro irrigation",
      "drip",
      "sprinkler",
      "water saving",
      "pmksy"
    ],

    matching: {
      needs: ["irrigation"],
      crops: [
        "cotton",
        "sugarcane",
        "vegetables",
        "banana",
        "grapes",
        "mango",
        "orchard",
        "all"
      ],
      seasons: ["kharif", "rabi", "summer"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: [
        "well",
        "borewell",
        "canal",
        "surface water",
        "all"
      ],
      landTypes: ["irrigated", "rainfed", "all"],
      minLandArea: 0,
      maxLandArea: 12.355
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 5. SUB-MISSION ON FARM MECHANIZATION
  // =========================================================
  {
    name: "Sub-Mission on Farm Mechanization",
    title: "Sub-Mission on Farm Mechanization",

    slug: "sub-mission-farm-mechanization",

    subtitle:
      "Support for eligible farm machinery and agricultural equipment",

    category: "Farm Equipment",
    government: "Maharashtra Agriculture Department",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/farm-equipment.jpg",

    benefit:
      "Financial assistance for eligible agricultural machinery and equipment under applicable farm mechanization components.",

    overview:
      "The Sub-Mission on Farm Mechanization promotes farm mechanization and improves access to eligible agricultural machinery and equipment. Maharashtra provides applicable components through the MahaDBT Farmer Portal.",

    eligibility: [
      "Farmer must satisfy the applicable component eligibility conditions.",
      "The selected machinery or equipment must be an eligible component.",
      "Farmer and land records must satisfy applicable requirements.",
      "Approval and subsidy depend on current government guidelines and component availability."
    ],

    documents: [
      "Farmer identity proof",
      "Land records",
      "Bank account details",
      "Farmer registration / Farmer ID as applicable",
      "Quotation or machinery details where required"
    ],

    applicationSteps: [
      "Register or login to the MahaDBT Farmer Portal.",
      "Select the Farm Mechanization component.",
      "Choose the eligible machinery or equipment.",
      "Submit required documents and application details.",
      "Complete verification and follow the official approval process."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "equipment",
      "farm machinery",
      "tractor",
      "mechanization",
      "agricultural equipment"
    ],

    matching: {
      needs: ["equipment"],
      crops: ["all"],
      seasons: ["all"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["all"],
      landTypes: ["all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 6. NFSM
  // =========================================================
  {
    name: "National Food Security Mission",
    title:
      "National Food Security Mission - Food Grains, Oilseeds, Sugarcane and Cotton",

    slug: "national-food-security-mission",

    subtitle:
      "Support for production, seeds and productivity improvement in notified crops",

    category: "Seeds / Inputs",
    government: "Government of India / Maharashtra Agriculture Department",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/seeds.jpg",

    benefit:
      "Support for eligible crop, seed and productivity-related components under notified NFSM programmes.",

    overview:
      "The National Food Security Mission supports productivity and production of selected foodgrain, oilseed and commercial crops through notified interventions implemented by the agriculture department.",

    eligibility: [
      "Farmer must satisfy the applicable NFSM component conditions.",
      "The selected crop or activity must be included in the applicable programme.",
      "District and crop eligibility can vary by component.",
      "Current department notification should be checked before applying."
    ],

    documents: [
      "Farmer identity proof",
      "Land records",
      "Bank account details",
      "Crop details",
      "Farmer registration details as required"
    ],

    applicationSteps: [
      "Check the current NFSM component available in your area.",
      "Confirm crop and farmer eligibility.",
      "Register or login through the applicable Maharashtra agriculture portal.",
      "Submit required farmer and crop details.",
      "Complete verification and follow the department process."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "seeds",
      "food grains",
      "oilseeds",
      "cotton",
      "sugarcane",
      "productivity"
    ],

    matching: {
      needs: ["seeds", "support"],
      crops: [
        "cotton",
        "soybean",
        "wheat",
        "rice",
        "gram",
        "chickpea",
        "tur",
        "sorghum",
        "sugarcane",
        "oilseeds"
      ],
      seasons: ["kharif", "rabi", "summer"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["rainfed", "well", "borewell", "canal", "all"],
      landTypes: ["rainfed", "irrigated", "all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 7. MIDH
  // =========================================================
  {
    name: "Mission for Integrated Development of Horticulture",
    title: "Mission for Integrated Development of Horticulture",

    slug: "mission-integrated-development-horticulture",

    subtitle:
      "Support for horticulture, fruit crops and protected cultivation",

    category: "Horticulture",
    government: "Maharashtra Agriculture Department",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/horticulture.jpg",

    benefit:
      "Support for eligible horticulture development activities, including notified fruit crops and protected cultivation components.",

    overview:
      "Mission for Integrated Development of Horticulture supports development of horticulture and related infrastructure/components. Maharashtra implements applicable components through the agriculture department and MahaDBT portal.",

    eligibility: [
      "Farmer must satisfy the applicable horticulture component conditions.",
      "Crop, project or activity must be included in the notified component.",
      "Land and project details must meet applicable requirements.",
      "Current component availability should be verified before applying."
    ],

    documents: [
      "Identity proof",
      "Land records",
      "Bank account details",
      "Crop or project details",
      "Additional technical documents where required"
    ],

    applicationSteps: [
      "Check the available horticulture component on MahaDBT.",
      "Confirm crop or project eligibility.",
      "Submit the application through the applicable government portal.",
      "Upload required documents and project details.",
      "Complete departmental verification and track the application."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "horticulture",
      "fruit crops",
      "orchard",
      "protected cultivation",
      "vegetables"
    ],

    matching: {
      needs: ["horticulture"],
      crops: [
        "mango",
        "grapes",
        "banana",
        "orange",
        "pomegranate",
        "vegetables",
        "orchard",
        "horticulture",
        "all"
      ],
      seasons: ["kharif", "rabi", "summer"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["well", "borewell", "canal", "all"],
      landTypes: ["irrigated", "rainfed", "all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 8. RAINFED AREA DEVELOPMENT
  // =========================================================
  {
    name: "Rainfed Area Development",
    title: "Rainfed Area Development Programme",

    slug: "rainfed-area-development",

    subtitle:
      "Integrated farming support for eligible rainfed areas",

    category: "Financial Support",
    government: "Maharashtra Agriculture Department",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/rainfed.jpg",

    benefit:
      "Financial assistance for eligible integrated farming system components in notified rainfed area development projects.",

    overview:
      "The Rainfed Area Development Programme promotes integrated farming systems and related activities in eligible project areas. Maharashtra's current programme covers districts across the state, with project and village selection conditions.",

    eligibility: [
      "Farmer must fall within an eligible project or cluster area.",
      "Farmer must satisfy the current programme conditions.",
      "Integrated Farming System adoption may be required for eligible beneficiaries.",
      "Current project selection and village conditions must be verified."
    ],

    documents: [
      "Farmer identity proof",
      "Land details",
      "Bank account details",
      "Farmer ID / AgriStack details where required",
      "Caste certificate where specifically applicable"
    ],

    applicationSteps: [
      "Check whether your village or project area is covered.",
      "Confirm the applicable project and beneficiary conditions.",
      "Contact the agriculture department or applicable MahaDBT channel.",
      "Submit the required farmer and project information.",
      "Complete verification and follow the project implementation process."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "rainfed",
      "integrated farming",
      "water management",
      "financial support",
      "farm development"
    ],

    matching: {
      needs: ["financial", "support", "irrigation"],
      crops: [
        "cotton",
        "soybean",
        "tur",
        "gram",
        "chickpea",
        "sorghum",
        "millet",
        "oilseeds",
        "all"
      ],
      seasons: ["kharif", "rabi"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["rainfed"],
      landTypes: ["rainfed"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 9. BHAUSAHEB FUNDKAR PHALBAAG LAGVAD
  // =========================================================
  {
    name: "Bhausaheb Fundkar Phalbaag Lagvad Yojana",
    title: "Bhausaheb Fundkar Phalbaag Lagvad Yojana",

    slug: "bhausaheb-fundkar-phalbaag-lagvad",

    subtitle:
      "Support for eligible fruit orchard establishment",

    category: "Horticulture",
    government: "Maharashtra Government",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/horticulture.jpg",

    benefit:
      "Support for eligible fruit orchard establishment and related horticulture activities under the applicable Maharashtra programme.",

    overview:
      "Bhausaheb Fundkar Phalbaag Lagvad Yojana supports eligible farmers undertaking fruit orchard development under the applicable Maharashtra agriculture guidelines.",

    eligibility: [
      "Farmer must satisfy the current scheme eligibility conditions.",
      "The proposed fruit crop must be covered under the applicable programme.",
      "Land and plantation details must meet the notified requirements.",
      "Current scheme availability and component conditions should be checked before applying."
    ],

    documents: [
      "Farmer identity proof",
      "Land records",
      "Bank account details",
      "Orchard / plantation details",
      "Additional documents required by the department"
    ],

    applicationSteps: [
      "Check the current Phalbaag Lagvad scheme availability.",
      "Select the eligible fruit crop or orchard component.",
      "Apply through the applicable Maharashtra agriculture portal.",
      "Submit land and plantation details.",
      "Complete field verification and follow the department process."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "horticulture",
      "orchard",
      "fruit crop",
      "fruit plantation",
      "phalbaag"
    ],

    matching: {
      needs: ["horticulture"],
      crops: [
        "mango",
        "grapes",
        "banana",
        "orange",
        "pomegranate",
        "guava",
        "citrus",
        "orchard"
      ],
      seasons: ["kharif", "rabi", "summer"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["well", "borewell", "canal", "all"],
      landTypes: ["irrigated", "rainfed", "all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 10. STATE AGRICULTURE MECHANIZATION
  // =========================================================
  {
    name: "State Agriculture Mechanization Scheme",
    title: "State Agriculture Mechanization Scheme",

    slug: "state-agriculture-mechanization",

    subtitle:
      "Maharashtra support for eligible agricultural machinery",

    category: "Farm Equipment",
    government: "Maharashtra Government",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/farm-equipment.jpg",

    benefit:
      "Support for eligible farm machinery and mechanization components under Maharashtra agriculture programmes.",

    overview:
      "The State Agriculture Mechanization Scheme supports eligible farmers with access to notified agricultural machinery and mechanization components through Maharashtra agriculture programmes.",

    eligibility: [
      "Farmer must satisfy the applicable state scheme conditions.",
      "Selected machinery must be an eligible component.",
      "Farmer registration and land details must meet applicable requirements.",
      "Current availability depends on departmental notifications and funds."
    ],

    documents: [
      "Farmer identity proof",
      "Land records",
      "Bank account details",
      "Farmer ID / registration details",
      "Machinery quotation where required"
    ],

    applicationSteps: [
      "Login to the MahaDBT Farmer Portal.",
      "Check the State Agriculture Mechanization Scheme.",
      "Select the applicable machinery component.",
      "Submit documents and application details.",
      "Track application and approval status."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "equipment",
      "machinery",
      "tractor",
      "farm mechanization",
      "state scheme"
    ],

    matching: {
      needs: ["equipment"],
      crops: ["all"],
      seasons: ["all"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["all"],
      landTypes: ["all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 11. CHIEF MINISTER SUSTAINABLE AGRICULTURE IRRIGATION
  // =========================================================
  {
    name: "Chief Minister Sustainable Agriculture Irrigation Scheme",
    title: "Chief Minister Sustainable Agriculture Irrigation Scheme",

    slug: "chief-minister-sustainable-agriculture-irrigation",

    subtitle:
      "Support for sustainable and efficient agricultural irrigation",

    category: "Irrigation",
    government: "Maharashtra Government",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/irrigation.jpg",

    benefit:
      "Support for eligible sustainable agricultural irrigation components under applicable Maharashtra government programmes.",

    overview:
      "The Chief Minister Sustainable Agriculture Irrigation Scheme is listed among Maharashtra Agriculture Department farmer schemes. Eligibility and supported components depend on the applicable government guidelines and current programme availability.",

    eligibility: [
      "Farmer must satisfy the current scheme conditions.",
      "The proposed irrigation activity must be an eligible component.",
      "Land and farmer records must meet applicable requirements.",
      "Approval is subject to current departmental guidelines."
    ],

    documents: [
      "Farmer identity proof",
      "Land records",
      "Bank account details",
      "Farmer registration details",
      "Irrigation project or system details where required"
    ],

    applicationSteps: [
      "Check current scheme availability on the Maharashtra agriculture portal.",
      "Confirm the eligible irrigation component.",
      "Submit the application through the authorised portal.",
      "Upload required farmer and land documents.",
      "Complete verification and track application status."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "irrigation",
      "water management",
      "sustainable agriculture",
      "water saving"
    ],

    matching: {
      needs: ["irrigation"],
      crops: ["all"],
      seasons: ["kharif", "rabi", "summer"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: [
        "rainfed",
        "well",
        "borewell",
        "canal",
        "all"
      ],
      landTypes: ["rainfed", "irrigated", "all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  },

  // =========================================================
  // 12. RASHTRIYA KRUSHI VIKAS YOJANA - RAFTAAR
  // =========================================================
  {
    name: "Rashtriya Krushi Vikas Yojana - RAFTAAR",
    title: "Rashtriya Krushi Vikas Yojana - RAFTAAR",

    slug: "rashtriya-krushi-vikas-yojana-raftaar",

    subtitle:
      "Support for agriculture development and eligible project components",

    category: "Financial Support",
    government: "Government of India / Maharashtra Agriculture Department",
    state: "Maharashtra",
    status: "Available",

    image: "/images/schemes/rkvy.jpg",

    benefit:
      "Support for eligible agriculture development projects and notified components under the applicable RKVY-RAFTAAR programme.",

    overview:
      "Rashtriya Krushi Vikas Yojana - RAFTAAR supports agriculture and allied-sector development through approved projects and components implemented by states.",

    eligibility: [
      "Eligibility depends on the approved project or component.",
      "Farmer, group, FPO or project-level eligibility may vary.",
      "The proposed activity must fall within the applicable programme.",
      "Current project availability and guidelines should be checked before applying."
    ],

    documents: [
      "Identity proof",
      "Land or project details",
      "Bank account details",
      "Farmer registration details",
      "Additional project documents where required"
    ],

    applicationSteps: [
      "Check the currently available RKVY-RAFTAAR component.",
      "Verify the applicable beneficiary or project eligibility.",
      "Apply through the authorised government channel.",
      "Submit required project and farmer information.",
      "Complete verification and follow the approved implementation process."
    ],

    officialUrl: "https://mahadbt.maharashtra.gov.in",
    applyUrl: "https://mahadbt.maharashtra.gov.in",

    tags: [
      "agriculture development",
      "financial support",
      "farm development",
      "rkvy",
      "raftaar"
    ],

    matching: {
      needs: ["financial", "support", "equipment", "irrigation"],
      crops: ["all"],
      seasons: ["kharif", "rabi", "summer"],
      farmerTypes: [
        "small",
        "marginal",
        "medium",
        "landholding",
        "all"
      ],
      irrigation: ["all"],
      landTypes: ["all"],
      minLandArea: 0,
      maxLandArea: null
    },

    districts: ["all"],

    sourceUrl: "https://mahadbt.maharashtra.gov.in",
    verifiedAt: new Date()
  }
];


// =========================================================
// SEED FUNCTION
// =========================================================

async function seedSchemes() {
  try {
    await connectDB();

    console.log("Database:", mongoose.connection.name);

    // Remove old scheme records
    await Scheme.deleteMany({});

    console.log("Cleared existing schemes.");

    // Insert new scheme records
    const inserted = await Scheme.insertMany(schemes);

    console.log(
      `Inserted ${inserted.length} schemes successfully.`
    );

    console.log("Scheme seeding completed successfully.");

    // Print inserted schemes for verification
    inserted.forEach((scheme, index) => {
      console.log(
        `${index + 1}. ${scheme.title} | ${scheme.category} | ${scheme.slug}`
      );
    });

  } catch (error) {
    console.error("Scheme seed failed:", error);

  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  }
}

seedSchemes();