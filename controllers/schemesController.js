const Scheme = require("../Models/Scheme");

const showSchemespage = async (req, res) => {
  try {
    const viewAll = req.query.view === "all";
    const allSchemes = await Scheme.find({}).sort({ title: 1 });
    const schemesForView = viewAll ? allSchemes : allSchemes.slice(0, 6);

    res.render("schemes/index", {
      schemes: schemesForView,
      allSchemes,
      viewAll,
      totalSchemes: allSchemes.length,
    });
  } catch (error) {
    console.error("Error loading schemes:", error);
    res.status(500).send("Unable to load government schemes.");
  }
};

const showAllSchemesPage = async (req, res) => {
  try {
    const schemes = await Scheme.find({}).sort({ title: 1 });

    res.render("schemes/allschems", {
      title: "KisaanMitra AI — All Government Schemes",
      schemes,
    });
  } catch (error) {
    console.error("Error loading all schemes:", error);
    res.status(500).send("Unable to load government schemes.");
  }
};

const showSchemeDetails = async (req, res) => {
  try {
    const scheme = await Scheme.findOne({ slug: req.params.slug });

    if (!scheme) {
      return res.status(404).render("schemes/details", {
        scheme: null,
        message: "Scheme not found.",
      });
    }

    res.render("schemes/details", { scheme });
  } catch (error) {
    console.error("Error loading scheme details:", error);
    res.status(500).send("Unable to load scheme details.");
  }
};


const showFinderPage = (req, res) => {
  res.render("schemes/finder", {
    title: "KisaanMitra AI — Find My Schemes",
    schemes: [],
  });
};


const findSchemes = async (req, res) => {
  try {
    // ==========================================
    // 1. GET FARMER INPUT
    // ==========================================
    const data = req.body && Object.keys(req.body).length
      ? req.body
      : req.query;

    const state = String(data.state || "").trim().toLowerCase();
    const district = String(data.district || "").trim().toLowerCase();
    const taluka = String(data.taluka || "").trim().toLowerCase();
    const village = String(data.village || "").trim().toLowerCase();

    const landArea = Number(data.landArea || data.area || 0);

    const landType = String(data.landType || "").trim().toLowerCase();
    const crop = String(data.crop || "").trim().toLowerCase();
    const irrigation = String(data.irrigation || "").trim().toLowerCase();
    const season = String(data.season || "").trim().toLowerCase();

    const supportNeed = String(
      data.supportNeed || data.need || ""
    ).trim().toLowerCase();


    // ==========================================
    // 2. BASIC VALIDATION
    // ==========================================
    if (!state || !district || !landArea || !crop || !supportNeed) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required farmer information.",
      });
    }


    // ==========================================
    // 3. GET ACTIVE SCHEMES FROM MONGODB
    // ==========================================
    const schemes = await Scheme.find({
      status: { $in: ["Available", "Seasonal", "Limited"] },
    }).lean();


    // ==========================================
    // 4. NORMALIZE ARRAY HELPER
    // ==========================================
    const normalizeArray = (value) => {
      if (!Array.isArray(value)) return [];

      return value
        .map(item => String(item).trim().toLowerCase())
        .filter(Boolean);
    };


    // ==========================================
    // 5. MATCH EVERY SCHEME
    // ==========================================
    const results = schemes.map((scheme) => {
      const matching = scheme.matching || {};

      const needs = normalizeArray(matching.needs);
      const crops = normalizeArray(matching.crops);
      const seasons = normalizeArray(matching.seasons);
      const farmerTypes = normalizeArray(matching.farmerTypes);
      const irrigationTypes = normalizeArray(matching.irrigation);
      const landTypes = normalizeArray(matching.landTypes);
      const districts = normalizeArray(scheme.districts);


      let score = 0;
      const reasons = [];


      // ==========================================
      // SUPPORT NEED — 30 POINTS
      // ==========================================
      if (
        supportNeed &&
        (
          needs.includes(supportNeed) ||
          needs.includes("all")
        )
      ) {
        score += 30;
        reasons.push("Your support requirement matches");
      }


      // ==========================================
      // STATE — 15 POINTS
      // ==========================================
      const schemeState = String(scheme.state || "")
        .trim()
        .toLowerCase();

      if (
        schemeState === "all" ||
        schemeState === state
      ) {
        score += 15;
        reasons.push("Available in your state");
      }


      // ==========================================
      // DISTRICT — 10 POINTS
      // ==========================================
      if (
        district &&
        (
          districts.includes("all") ||
          districts.includes(district)
        )
      ) {
        score += 10;
        reasons.push("Available in your district");
      }


      // ==========================================
      // CROP — 15 POINTS
      // ==========================================
      if (
        crop &&
        (
          crops.includes("all") ||
          crops.includes(crop)
        )
      ) {
        score += 15;
        reasons.push("Suitable for your crop");
      }


      // ==========================================
      // SEASON — 10 POINTS
      // ==========================================
      if (
        season &&
        (
          seasons.includes("all") ||
          seasons.includes(season)
        )
      ) {
        score += 10;
        reasons.push("Matches your farming season");
      }


      // ==========================================
      // IRRIGATION — 5 POINTS
      // ==========================================
      if (
        irrigation &&
        (
          irrigationTypes.includes("all") ||
          irrigationTypes.includes(irrigation)
        )
      ) {
        score += 5;
        reasons.push("Matches your irrigation type");
      }


      // ==========================================
      // LAND TYPE — 5 POINTS
      // ==========================================
      if (
        landType &&
        (
          landTypes.includes("all") ||
          landTypes.includes(landType)
        )
      ) {
        score += 5;
        reasons.push("Matches your soil / land type");
      }


      // ==========================================
      // LAND AREA — 10 POINTS
      // ==========================================
      const minLandArea = Number(matching.minLandArea || 0);

      const maxLandArea =
        matching.maxLandArea === null ||
        matching.maxLandArea === undefined ||
        matching.maxLandArea === ""
          ? null
          : Number(matching.maxLandArea);


      let landAreaMatches = true;

      if (landArea < minLandArea) {
        landAreaMatches = false;
      }

      if (
        maxLandArea !== null &&
        landArea > maxLandArea
      ) {
        landAreaMatches = false;
      }

      if (landAreaMatches) {
        score += 10;
        reasons.push("Your farm area matches");
      }


      // ==========================================
      // RETURN MATCHED SCHEME
      // ==========================================
      return {
        ...scheme,

        score,

        matchPercentage: Math.min(score, 100),

        reasons,

        matchedProfile: {
          state,
          district,
          taluka,
          village,
          landArea,
          landType,
          crop,
          irrigation,
          season,
          supportNeed,
        },
      };
    });


    // ==========================================
    // 6. REMOVE LOW RELEVANCE SCHEMES
    // ==========================================
    const matchedSchemes = results
      .filter((scheme) => scheme.score >= 40)
      .sort((a, b) => b.score - a.score);


    // ==========================================
    // 7. RETURN JSON FOR FIND MY SCHEMES PAGE
    // ==========================================
    return res.status(200).json({
      success: true,

      message:
        matchedSchemes.length > 0
          ? "Schemes matched successfully."
          : "No highly matched schemes found.",

      profile: {
        state,
        district,
        taluka,
        village,
        landArea,
        landType,
        crop,
        irrigation,
        season,
        supportNeed,
      },

      totalResults: matchedSchemes.length,

      results: matchedSchemes,
    });

  } catch (error) {
    console.error("Error matching government schemes:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to match government schemes.",
    });
  }
};

module.exports = { showSchemespage, showAllSchemesPage, showSchemeDetails, showFinderPage, findSchemes };