const {
    analyzeCropDisease
} = require("../config/gemini");

// ============================================
// GET CROP DISEASE PAGE
// ============================================

const getCropDiseasePage = (req, res) => {
    res.render("cropdisease/index", {
        // result: null,
        // error: null
    });
};


// ============================================
// ANALYZE CROP DISEASE
// ============================================

const analyzeDisease = async (req, res) => {

    try {

        // Check image
        if (!req.file) {

            return res.status(400).render("cropdisease", {
                result: null,
                error: "Please upload a clear crop image."
            });

        }

        // Get farmer inputs
        const {
            cropName,
            location,
            farmerQuestion,
            language
        } = req.body;


        // Call Gemini AI
        const result = await analyzeCropDisease({

            imageBuffer: req.file.buffer,

            mimeType: req.file.mimetype,

            cropName,

            location,

            farmerQuestion,

            language: language || "Marathi"

        });


        // Render result
        res.render("cropdisease", {

            result: result,

            error: null

        });


    } catch (error) {
  console.error("Crop Disease Analysis Error:", error);

  let errorMessage =
    "AI service temporarily busy. Please try again after some time.";

  if (error.status === 400) {
    errorMessage =
      "Invalid image or request. Please upload a valid crop image.";
  }

  if (error.status === 429) {
    errorMessage =
      "Too many requests. Please wait and try again.";
  }

  res.status(503).render("cropdisease/index", {
    result: null,
    error: errorMessage
  });
}

};


// ============================================
// EXPORT CONTROLLERS
// ============================================

module.exports = {

    getCropDiseasePage,

    analyzeDisease

};