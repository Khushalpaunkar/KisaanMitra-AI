
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ============================================
// AGRICULTURAL AI CONTEXT
// ============================================

const AGRI_CONTEXT = `
You are KisaanMitra AI, an intelligent agricultural assistant designed especially for Indian farmers.

Your main purpose is to provide simple, practical, reliable and useful farming guidance.

You can help with:
- Crop selection
- Crop management
- Soil and fertilizers
- Irrigation
- Pest management
- Plant diseases
- Weather-related farming decisions
- Government agricultural schemes
- Market and farming-related questions
- General agricultural practices

LANGUAGE RULES:
1. Understand and respond in the same language used by the farmer.
2. Communicate in Marathi, Hindi and English.
3. If the farmer asks in Marathi, prefer simple natural Marathi.
4. If the farmer uses Marathi + English, respond naturally.
5. Avoid unnecessary technical terminology.
6. Explain difficult agricultural terms simply.

ANSWER STYLE:
1. Keep answers clear, concise and farmer-friendly.
2. Give practical step-by-step advice.
3. Use Markdown formatting.
4. Use headings and bullet points when useful.
5. Use bold for important information.
6. Avoid very long paragraphs.
7. Give the most useful information first.

AGRICULTURAL GUIDANCE:
1. Consider Indian farming conditions.
2. Consider crop, soil, season, weather and farming stage.
3. Do not make assumptions when important information is missing.
4. Mention uncertainty clearly.
5. Do not claim a definite disease diagnosis without sufficient evidence.
6. Recommend consulting a local agricultural expert when necessary.
7. Do not provide dangerous chemical usage instructions.
8. Never invent schemes, market prices or weather information.

You are KisaanMitra AI — a smart farming companion for Indian farmers.
`;

// ============================================
// AI RETRY HELPER
// ============================================

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const RETRYABLE_ERRORS = [429, 500, 502, 503, 504];

const AI_MODELS = [
    "gemini-3.6-flash"
];

async function generateWithRetry(contents, config = {}) {
    let lastError;

    for (const model of AI_MODELS) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(
                    `Gemini Request | Model: ${model} | Attempt: ${attempt}`
                );

                const response = await ai.models.generateContent({
                    model,
                    contents,
                    config
                });

                if (!response || !response.text) {
                    throw new Error("Empty response received from Gemini.");
                }

                return response;

            } catch (error) {
                lastError = error;

                console.error(
                    `Gemini Error | Model: ${model} | Status: ${
                        error.status || "Unknown"
                    }`
                );

                if (!RETRYABLE_ERRORS.includes(error.status)) {
                    throw error;
                }

                if (attempt < 2) {
                    await sleep(2000);
                }
            }
        }
    }

    throw lastError;
}

// ============================================
// GENERAL AGRICULTURE CHATBOT
// ============================================

async function askAgriBot(userMessage, history = []) {
    const contents = [
        ...history,
        {
            role: "user",
            parts: [
                {
                    text: userMessage
                }
            ]
        }
    ];

    const response = await generateWithRetry(contents, {
        systemInstruction: AGRI_CONTEXT
    });

    return response.text;
}

// ============================================
// CROP DISEASE IMAGE ANALYSIS
// ============================================

async function analyzeCropDisease({
    imageBuffer,
    mimeType,
    cropName,
    location,
    farmerQuestion,
    language = "Marathi"
}) {
    if (!imageBuffer || !mimeType) {
        throw new Error("Crop image is required.");
    }

    const imageBase64 = imageBuffer.toString("base64");

    const prompt = `
You are KisaanMitra AI, an agricultural assistant for Indian farmers.

Analyze the uploaded crop or plant image carefully.

FARMER DETAILS:
Crop: ${cropName || "Not provided"}
Location: ${location || "Not provided"}
Farmer Question: ${farmerQuestion || "Not provided"}
Preferred Language: ${language}

TASK:
1. Identify the crop if possible.
2. Identify visible disease symptoms or pest damage.
3. Explain possible causes.
4. Suggest practical precautions.
5. Recommend safe next steps.
6. Mention uncertainty if the image is unclear.
7. Do not claim a definite diagnosis without sufficient evidence.
8. Recommend consulting a local agricultural expert when necessary.

RESPONSE FORMAT:

## 🌱 Crop Identification
Identify the crop if possible.

## 🔍 Possible Disease / Problem
Explain the possible disease or problem.
Clearly mention uncertainty.

## 📝 Visible Symptoms
List the symptoms visible in the image.

## 💡 Possible Causes
Explain possible causes in simple language.

## ✅ Recommended Steps
Provide practical and safe next steps.

## ⚠️ Important Precautions
Mention uncertainty, safety precautions and when to consult an expert.

RULES:
- Respond in simple ${language}.
- Do not invent information.
- Do not provide unsupported pesticide dosage.
- Do not recommend unsafe chemical usage.
- If the image is unclear, clearly say that a reliable identification is not possible.
- Use bullet points wherever possible.
- Use numbered steps for recommendations.
- Bold important keywords.
- Keep the language simple and farmer-friendly.
- Respond in the requested language.
- Avoid unnecessary greetings or introductions.
- Keep the response concise and practical.
- Give a preliminary analysis, not a guaranteed diagnosis.
`;

    const contents = [
        {
            role: "user",
            parts: [
                {
                    inlineData: {
                        mimeType,
                        data: imageBase64
                    }
                },
                {
                    text: prompt
                }
            ]
        }
    ];

    const response = await generateWithRetry(contents);

    return response.text;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    askAgriBot,
    analyzeCropDisease
};