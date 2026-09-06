const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // प्रत्येक वेगळ्या chat/conversation साठी unique ID
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },

        message: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Chat", chatSchema);