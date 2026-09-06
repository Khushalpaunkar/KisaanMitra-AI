const mongoose = require("mongoose");
const { askAgriBot } = require("../config/gemini");
const Chat = require("../Models/Chat");


const sendMessage = async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "message is required"
            });
        }

        const userId = req.session.userId;

        let history = [];
        let currentConversationId = conversationId;

        // Logged-in user
        if (userId) {

            // जर conversationId नसेल तर नवीन conversation तयार करा
            if (!currentConversationId) {
                currentConversationId = new mongoose.Types.ObjectId();
            }

            // फक्त current conversation ची history घ्या
            const previousMessages = await Chat.find({
                userId: userId,
                conversationId: currentConversationId
            })
                .sort({ createdAt: 1 })
                .limit(20);

            history = previousMessages.map((chat) => ({
                role: chat.role === "assistant" ? "model" : "user",
                parts: [
                    {
                        text: chat.message
                    }
                ]
            }));
        }

        // Gemini ला current conversation ची history पाठवा
        const answer = await askAgriBot(message, history);

        // Logged-in user असेल तर messages save करा
        if (userId) {

            // User message
            await Chat.create({
                userId: userId,
                conversationId: currentConversationId,
                role: "user",
                message: message
            });

            // AI message
            await Chat.create({
                userId: userId,
                conversationId: currentConversationId,
                role: "assistant",
                message: answer
            });
        }

        res.status(200).json({
            success: true,
            answer: answer,
            conversationId: currentConversationId
        });

    } catch (error) {
        console.error("Chat Controller error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong with KisaanMitra AI"
        });
    }
};


const getChatHistory = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const messages = await Chat.find({ userId })
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error("Chat History error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load chat history"
        });
    }
};


module.exports = {
    sendMessage , getChatHistory
};