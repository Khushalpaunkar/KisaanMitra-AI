const { askAgriBot } = require("../config/gemini");


// =====================================================
// SHOW CROP INTELLIGENCE PAGE
// =====================================================

const showCropIntelligencePage = (req, res) => {
    res.render("crop/index");
};


// =====================================================
// AI CROP ANALYSIS
// =====================================================

const analyzeCrop = async (req, res) => {

    try {

        const {
            state,
            district,
            taluka,
            village,

            soilType,
            soilQuality,
            soilTest,

            waterAvailability,
            irrigationType,

            season,
            farmArea,

            previousCrop,
            previousResult,

            previousRecommendation,

            farmerSuggestion
        } = req.body;


        // -------------------------------------------------
        // REQUIRED FIELD VALIDATION
        // -------------------------------------------------

        if (
            !state ||
            !district ||
            !taluka ||
            !village ||
            !soilType ||
            !soilQuality ||
            !waterAvailability ||
            !irrigationType ||
            !season ||
            !farmArea ||
            !previousCrop ||
            !previousResult ||
            !farmerSuggestion
        ) {

            return res.status(400).json({
                success: false,
                message: "कृपया सर्व आवश्यक माहिती भरा."
            });

        }


        // -------------------------------------------------
        // AI PROMPT
        // -------------------------------------------------

        const cropPrompt = `

You are KisaanMitra AI — an agricultural crop recommendation
assistant specially designed for Indian farmers.

Analyze the farmer's field information and provide a practical
crop recommendation.

FARMER INFORMATION
------------------

State:
${state}

District:
${district}

Taluka:
${taluka}

Village:
${village}

Soil Type:
${soilType}

Soil Quality:
${soilQuality}

Soil Test Done:
${soilTest}

Water Availability:
${waterAvailability}

Irrigation Type:
${irrigationType}

Current Season:
${season}

Farm Area:
${farmArea} acres

Previous Crop:
${previousCrop}

Previous Crop Result:
${previousResult}

Previous AI Recommendation:
${previousRecommendation || "Not provided"}

Farmer Requirement / Suggestion:
${farmerSuggestion}


ANALYSIS REQUIREMENTS
---------------------

Analyze the following:

1. Soil suitability
2. Water availability
3. Current season
4. Previous crop and crop rotation
5. Soil quality
6. Irrigation availability
7. Farm size
8. Farmer's requirement
9. General suitability for Indian farming conditions


IMPORTANT RULES
---------------

- Recommend ONE primary crop.
- Provide TWO alternative crops.
- Suitability score must be between 0 and 100.
- Keep explanations simple and farmer-friendly.
- Do not invent current market prices.
- Do not invent current weather information.
- Do not invent government schemes.
- Do not claim exact profit or guaranteed yield.
- Mention uncertainty when local conditions may change the recommendation.
- The recommendation is guidance, not a guarantee.
- Consider the farmer's previous crop before recommending another crop.
- If the previous crop creates an important crop rotation concern,
  mention it in the caution section.


LANGUAGE
--------

If the farmer's requirement is written in Marathi,
respond in simple Marathi.

If written in English, respond in English.

If mixed Marathi-English is used,
naturally use Marathi-English where appropriate.


RETURN FORMAT
-------------

Return ONLY valid JSON.

Do not use Markdown.
Do not use \`\`\`json.
Do not add any text before or after JSON.


JSON STRUCTURE:

{
    "recommendedCrop": "Soybean",

    "suitability": 92,

    "soil": "Suitable",

    "water": "Medium",

    "duration": "90–110 days",

    "potential": "Medium-High",

    "reason": "Simple explanation of why this crop is suitable.",

    "alternatives": [
        {
            "crop": "Cotton",
            "suitability": 86
        },
        {
            "crop": "Tur",
            "suitability": 81
        }
    ],

    "analysis": {
        "soil": "Short soil analysis.",
        "water": "Short water analysis.",
        "season": "Short season analysis.",
        "previousCrop": "Short previous crop analysis."
    },

    "cautions": [
        "Important caution 1.",
        "Important caution 2."
    ],

    "advice": "Short practical advice for the farmer."
}

`;


        // -------------------------------------------------
        // CALL GEMINI
        // -------------------------------------------------

        const aiResponse = await askAgriBot(cropPrompt);


        // console.log("========== CROP AI RESPONSE ==========");
        // console.log(aiResponse);


        // -------------------------------------------------
        // CLEAN AI RESPONSE
        // -------------------------------------------------

        let cleanResponse = aiResponse
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();


        // -------------------------------------------------
        // PARSE JSON
        // -------------------------------------------------

        let recommendation;

        try {

            recommendation = JSON.parse(cleanResponse);

        } catch (parseError) {

            console.error("JSON Parse Error:", parseError);
            console.error("Raw AI Response:", aiResponse);

            return res.status(500).json({
                success: false,
                message: "AI recommendation format is invalid."
            });

        }


        // -------------------------------------------------
        // SEND RESPONSE TO FRONTEND
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            data: recommendation

        });


    } catch (error) {

        console.error("Crop Intelligence Error:", error);

        return res.status(500).json({

            success: false,

            message: "AI recommendation तयार करताना समस्या आली."

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    showCropIntelligencePage,
    analyzeCrop
};