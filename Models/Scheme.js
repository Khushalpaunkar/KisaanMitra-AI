const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    // ==============================
    // BASIC SCHEME INFORMATION
    // ==============================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    // ==============================
    // SCHEME CATEGORY
    // ==============================
    category: {
      type: String,
      required: true,
      enum: [
        "Financial Support",
        "Crop Insurance",
        "Agricultural Credit",
        "Farm Equipment",
        "Irrigation",
        "Seeds / Inputs",
        "Livestock",
        "Horticulture",
      ],
    },

    // ==============================
    // GOVERNMENT INFORMATION
    // ==============================
    government: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      default: "Maharashtra",
      trim: true,
    },

    // Optional district-level availability
    districts: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Available", "Seasonal", "Limited"],
      default: "Available",
    },

    // ==============================
    // DISPLAY / UI
    // ==============================
    image: {
      type: String,
      default: "/images/schemes/default.jpg",
    },

    benefit: {
      type: String,
      required: true,
      trim: true,
    },

    overview: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // ELIGIBILITY INFORMATION
    // ==============================
    eligibility: {
      type: [String],
      default: [],
    },

    documents: {
      type: [String],
      default: [],
    },

    applicationSteps: {
      type: [String],
      default: [],
    },

    // ==============================
    // OFFICIAL LINKS
    // ==============================
    officialUrl: {
      type: String,
      required: true,
      trim: true,
    },

    applyUrl: {
      type: String,
      required: true,
      trim: true,
    },

    sourceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // ==============================
    // SEARCH / GENERAL TAGS
    // ==============================
    tags: {
      type: [String],
      default: [],
    },

    // ==============================
    // FIND MY SCHEMES MATCHING DATA
    // ==============================
    matching: {
      // Financial / Insurance / Loan / Equipment etc.
      needs: {
        type: [String],
        default: [],
      },

      // Cotton / Soybean / Wheat / Rice etc.
      crops: {
        type: [String],
        default: [],
      },

      // Kharif / Rabi / Summer
      seasons: {
        type: [String],
        default: [],
      },

      // Small Farmer / Marginal Farmer / All Farmers etc.
      farmerTypes: {
        type: [String],
        default: [],
      },

      // Rainfed / Irrigated / Well / Borewell etc.
      irrigation: {
        type: [String],
        default: [],
      },

      // Black Soil / Red Soil / All etc.
      landTypes: {
        type: [String],
        default: [],
      },

      // Minimum land requirement
      minLandArea: {
        type: Number,
        default: 0,
      },

      // Maximum land requirement
      // null/undefined means no maximum limit
      maxLandArea: {
        type: Number,
        default: null,
      },
    },

    // ==============================
    // VERIFICATION
    // ==============================
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scheme", schemeSchema);