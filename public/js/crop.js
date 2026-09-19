function setRecommendationState(state) {

    const states = {
        loading: {
            loading: [true, "flex"],
            response: [false, "none"],
            error: [false, "none"]
        },
        success: {
            loading: [false, "none"],
            response: [true, "block"],
            error: [false, "none"]
        },
        error: {
            loading: [false, "none"],
            response: [false, "none"],
            error: [true, "flex"]
        }
    };

    const stateConfig = states[state];

    if (!stateConfig) {
        return;
    }

    Object.entries(stateConfig).forEach(([name, [isVisible, display]]) => {
        const element = document.getElementById(
            name === "loading"
                ? "aiLoading"
                : name === "response"
                    ? "aiResponse"
                    : "aiError"
        );

        if (element) {
            element.hidden = !isVisible;
            element.style.display = isVisible ? display : "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const form = document.getElementById("cropForm");

    const resultSection =
        document.getElementById("aiRecommendation");

    const loading =
        document.getElementById("aiLoading");

    const responseBox =
        document.getElementById("aiResponse");

    const errorBox =
        document.getElementById("aiError");

    const statusText =
        document.getElementById("aiStatusText");

    const newRecommendationBtn =
        document.getElementById("newRecommendationBtn");

    const copyRecommendationBtn =
        document.getElementById("copyRecommendationBtn");


    // =====================================================
    // FORM CHECK
    // =====================================================

    if (!form) {
        console.error("❌ Crop form not found.");
        return;
    }


    // =====================================================
    // FORM SUBMIT
    // =====================================================

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        // -------------------------------------------------
        // GET FORM DATA
        // -------------------------------------------------

        const formData = new FormData(form);

        const farmerData =
            Object.fromEntries(formData.entries());


        console.log("🌾 Farmer Input:", farmerData);


        // -------------------------------------------------
        // SHOW RESULT SECTION
        // -------------------------------------------------

        if (resultSection) {

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        // -------------------------------------------------
        // RESET UI
        // -------------------------------------------------

        setRecommendationState("loading");

        if (responseBox) {
            responseBox.innerHTML = "";
        }

        if (statusText) {

            statusText.textContent =
                "तुमच्या शेताची माहिती आणि गरजांचे AI द्वारे विश्लेषण केले जात आहे...";

        }


        // -------------------------------------------------
        // DISABLE BUTTON
        // -------------------------------------------------

        const submitButton =
            form.querySelector(".farm-analyse-btn");

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.dataset.originalText =
                submitButton.innerHTML;

            submitButton.innerHTML =
                "⏳ AI विश्लेषण सुरू आहे...";

        }


        try {

            // =================================================
            // SEND DATA TO BACKEND
            // =================================================

            const response =
                await fetch("/cropintelligence/analyze", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(farmerData)

                });


            const result =
                await response.json();


            console.log("🤖 AI Result:", result);


            // =================================================
            // CHECK ERROR
            // =================================================

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "AI recommendation failed."
                );

            }


            // =================================================
            // DISPLAY RESULT
            // =================================================

            displayCropRecommendation(
                result.data,
                farmerData
            );


        } catch (error) {

            console.error(
                "❌ Crop Recommendation Error:",
                error
            );


            setRecommendationState("error");


            if (statusText) {

                statusText.textContent =
                    "AI recommendation मिळवताना समस्या आली.";

            }

        } finally {

            // =================================================
            // ENABLE BUTTON AGAIN
            // =================================================

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    submitButton.dataset.originalText ||
                    "✨ AI Recommendation मिळवा";

            }

        }

    });


    // =====================================================
    // NEW RECOMMENDATION BUTTON
    // =====================================================

    if (newRecommendationBtn) {

        newRecommendationBtn.addEventListener(
            "click",
            () => {

                form.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                // Optional:
                // form.reset();

            }
        );

    }


    // =====================================================
    // COPY RECOMMENDATION BUTTON
    // =====================================================

    if (copyRecommendationBtn) {

        copyRecommendationBtn.addEventListener(
            "click",
            async () => {

                const text =
                    createCopyText();


                if (!text) {
                    return;
                }


                try {

                    await navigator.clipboard.writeText(text);


                    const originalText =
                        copyRecommendationBtn.innerHTML;


                    copyRecommendationBtn.innerHTML =
                        "✅ सल्ला कॉपी झाला";


                    setTimeout(() => {

                        copyRecommendationBtn.innerHTML =
                            originalText;

                    }, 2000);


                } catch (error) {

                    console.error(
                        "Copy failed:",
                        error
                    );

                }

            }
        );

    }

});


// =====================================================
// DISPLAY AI RECOMMENDATION
// =====================================================

function displayCropRecommendation(
    recommendation,
    farmerData
) {

    const loading =
        document.getElementById("aiLoading");

    const responseBox =
        document.getElementById("aiResponse");

    const statusText =
        document.getElementById("aiStatusText");


    // =====================================================
    // SAFETY DEFAULTS
    // =====================================================

    recommendation =
        recommendation || {};

    recommendation.analysis =
        recommendation.analysis || {};

    recommendation.alternatives =
        Array.isArray(recommendation.alternatives)
            ? recommendation.alternatives
            : [];

    recommendation.cautions =
        Array.isArray(recommendation.cautions)
            ? recommendation.cautions
            : [];


    // =====================================================
    // LOADING OFF
    // =====================================================

    // =====================================================
    // FARMER INPUT SUMMARY
    // =====================================================

    const resultLocation =
        document.getElementById("resultLocation");

    const resultSoil =
        document.getElementById("resultSoil");

    const resultWater =
        document.getElementById("resultWater");

    const resultSeason =
        document.getElementById("resultSeason");


    if (resultLocation) {

        resultLocation.textContent =
            `${farmerData.village || "—"}, ` +
            `${farmerData.taluka || "—"}, ` +
            `${farmerData.district || "—"}`;

    }


    if (resultSoil) {

        resultSoil.textContent =
            farmerData.soilType || "—";

    }


    if (resultWater) {

        resultWater.textContent =
            formatWater(farmerData.waterAvailability);

    }


    if (resultSeason) {

        resultSeason.textContent =
            formatSeason(farmerData.season);

    }


    // =====================================================
    // AI STATUS
    // =====================================================

    if (statusText) {

        statusText.textContent =
            "तुमच्या शेताच्या माहितीचे विश्लेषण पूर्ण झाले आहे.";

    }


    // =====================================================
    // SUITABILITY
    // =====================================================

    const suitability =
        Number(recommendation.suitability) || 0;


    const safeSuitability =
        Math.min(
            100,
            Math.max(0, suitability)
        );


    // =====================================================
    // BUILD RESPONSE
    // =====================================================

    if (!responseBox) {
        return;
    }


    responseBox.innerHTML = `

        <!-- =========================================
             MAIN CROP
        ========================================== -->

        <div class="ai-main-crop">

            <span class="ai-main-crop-icon">
                🌱
            </span>

            <div class="ai-main-crop-info">

                <small>
                    AI ने सुचवलेले पीक
                </small>

                <h3>
                    ${escapeHTML(
                        recommendation.recommendedCrop ||
                        "पीक उपलब्ध नाही"
                    )}
                </h3>

            </div>

            <div class="ai-suitability">

                <strong>
                    ${safeSuitability}%
                </strong>

                <span>
                    योग्य
                </span>

            </div>

        </div>


        <!-- =========================================
             SUITABILITY BAR
        ========================================== -->

        <div class="ai-suitability-bar">

            <div
                class="ai-suitability-progress"
                style="width:${safeSuitability}%"
            ></div>

        </div>


        <!-- =========================================
             CROP DETAILS
        ========================================== -->

        <div class="ai-crop-details">

            <div>

                <small>
                    🌍 माती
                </small>

                <strong>
                    ${escapeHTML(
                        recommendation.soil || "—"
                    )}
                </strong>

            </div>


            <div>

                <small>
                    💧 पाणी
                </small>

                <strong>
                    ${escapeHTML(
                        recommendation.water || "—"
                    )}
                </strong>

            </div>


            <div>

                <small>
                    📅 कालावधी
                </small>

                <strong>
                    ${escapeHTML(
                        recommendation.duration || "—"
                    )}
                </strong>

            </div>


            <div>

                <small>
                    📈 क्षमता
                </small>

                <strong>
                    ${escapeHTML(
                        recommendation.potential || "—"
                    )}
                </strong>

            </div>

        </div>


        <!-- =========================================
             WHY THIS CROP
        ========================================== -->

        <div class="ai-reason">

            <h4>
                🌱 हे पीक का योग्य आहे?
            </h4>

            <p>
                ${escapeHTML(
                    recommendation.reason ||
                    "AI कडून सध्या कारण उपलब्ध नाही."
                )}
            </p>

        </div>


        <!-- =========================================
             ALTERNATIVE CROPS
        ========================================== -->

        ${
            recommendation.alternatives.length
                ? `

                    <div class="ai-alternatives">

                        <h4>
                            🔄 इतर योग्य पर्याय
                        </h4>

                        <div class="ai-alternative-list">

                            ${
                                recommendation.alternatives
                                    .map(item => {

                                        const score =
                                            Number(
                                                item.suitability
                                            ) || 0;

                                        return `

                                            <div
                                                class="ai-alternative-item"
                                            >

                                                <span>
                                                    ${escapeHTML(
                                                        item.crop || "—"
                                                    )}
                                                </span>

                                                <strong>
                                                    ${score}%
                                                </strong>

                                            </div>

                                        `;

                                    })
                                    .join("")
                            }

                        </div>

                    </div>

                `
                : ""
        }


        <!-- =========================================
             AI ANALYSIS
        ========================================== -->

        <div class="ai-analysis-details">

            <h4>
                🔍 KisaanMitra AI ने काय पाहिले?
            </h4>


            <p>

                <strong>
                    🌱 माती:
                </strong>

                ${escapeHTML(
                    recommendation.analysis.soil || "—"
                )}

            </p>


            <p>

                <strong>
                    💧 पाणी:
                </strong>

                ${escapeHTML(
                    recommendation.analysis.water || "—"
                )}

            </p>


            <p>

                <strong>
                    ☀️ हंगाम:
                </strong>

                ${escapeHTML(
                    recommendation.analysis.season || "—"
                )}

            </p>


            <p>

                <strong>
                    🌾 मागील पीक:
                </strong>

                ${escapeHTML(
                    recommendation.analysis.previousCrop || "—"
                )}

            </p>

        </div>


        <!-- =========================================
             AI ADVICE
        ========================================== -->

        <div class="ai-advice">

            <h4>
                💡 KisaanMitra चा सल्ला
            </h4>

            <p>
                ${escapeHTML(
                    recommendation.advice ||
                    "स्थानिक परिस्थितीनुसार कृषी तज्ज्ञांचा सल्ला घ्या."
                )}
            </p>

        </div>


        <!-- =========================================
             CAUTIONS
        ========================================== -->

        ${
            recommendation.cautions.length
                ? `

                    <div class="ai-cautions">

                        <h4>
                            ⚠️ लक्षात ठेवा
                        </h4>

                        <ul>

                            ${
                                recommendation.cautions
                                    .map(caution => `

                                        <li>
                                            ${escapeHTML(caution)}
                                        </li>

                                    `)
                                    .join("")
                            }

                        </ul>

                    </div>

                `
                : ""
        }

    `;


    // =====================================================
    // SAVE RESULT FOR COPY BUTTON
    // =====================================================

    window.latestCropRecommendation = {
        recommendation,
        farmerData
    };

    setRecommendationState("success");

}


// =====================================================
// COPY TEXT GENERATOR
// =====================================================

function createCopyText() {

    const latest =
        window.latestCropRecommendation;


    if (!latest) {

        return "";

    }


    const {
        recommendation,
        farmerData
    } = latest;


    let text = "";


    text +=
        "🌱 KisaanMitra AI — Crop Recommendation\n\n";


    text +=
        `📍 स्थान: ${farmerData.village || "—"}, ` +
        `${farmerData.taluka || "—"}, ` +
        `${farmerData.district || "—"}\n`;


    text +=
        `🌱 माती: ${farmerData.soilType || "—"}\n`;


    text +=
        `💧 पाणी: ${farmerData.waterAvailability || "—"}\n`;


    text +=
        `☀️ हंगाम: ${farmerData.season || "—"}\n\n`;


    text +=
        `🌾 सुचवलेले पीक: ` +
        `${recommendation.recommendedCrop || "—"}\n`;


    text +=
        `📊 Suitability: ` +
        `${recommendation.suitability || 0}%\n`;


    text +=
        `📅 कालावधी: ` +
        `${recommendation.duration || "—"}\n`;


    text +=
        `📈 क्षमता: ` +
        `${recommendation.potential || "—"}\n\n`;


    text +=
        `💡 कारण:\n` +
        `${recommendation.reason || "—"}\n\n`;


    if (
        recommendation.alternatives &&
        recommendation.alternatives.length
    ) {

        text +=
            "🔄 इतर पर्याय:\n";

        recommendation.alternatives.forEach(
            item => {

                text +=
                    `• ${item.crop || "—"} — ` +
                    `${item.suitability || 0}%\n`;

            }
        );

        text += "\n";

    }


    if (
        recommendation.cautions &&
        recommendation.cautions.length
    ) {

        text +=
            "⚠️ लक्षात ठेवा:\n";

        recommendation.cautions.forEach(
            caution => {

                text +=
                    `• ${caution}\n`;

            }
        );

    }


    return text;

}


// =====================================================
// FORMAT WATER
// =====================================================

function formatWater(value) {

    const map = {

        High: "भरपूर",

        Medium: "मध्यम",

        Low: "कमी",

        Rainfed: "फक्त पावसावर"

    };


    return map[value] || value || "—";

}


// =====================================================
// FORMAT SEASON
// =====================================================

function formatSeason(value) {

    const map = {

        Kharif: "खरीप",

        Rabi: "रब्बी",

        Summer: "उन्हाळी"

    };


    return map[value] || value || "—";

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;

}