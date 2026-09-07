const express = require("express");
const router = express.Router();
const User = require("../Models/User");


const { sendMessage, getChatHistory , getConversations ,  getConversationHistory, deleteConversation} = require("../controllers/chatController");

router.get("/" , async (req , res) => {
  const isLoggedIn = !!req.session.userId;
  const user = isLoggedIn ? await User.findById(req.session.userId) : null;


  res.render("chatbot/chat" , {
    isLoggedIn,
    user
  });
});



//AI chat API 
router.post("/message" , sendMessage)
router.get("/history", getChatHistory);
router.get("/conversations", getConversations);
router.get("/history/:conversationId", getConversationHistory);
router.delete("/history/:conversationId", deleteConversation);

module.exports = router;   