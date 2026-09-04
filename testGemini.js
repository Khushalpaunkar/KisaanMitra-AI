require("dotenv").config();
const { askAgriBot } = require("./config/gemini");

async function test() {
    try {
        const answer = await askAgriBot(
            "माझ्या कापूस पिकाची पाने पिवळी पडत आहेत. काय करावे?"
        );

        console.log("🤖 KisaanMitra AI:");
        console.log(answer);

    } catch (error) {
        console.error("❌ Gemini Error:");
        console.error(error.message);
    }
}

test();