const express = require("express");
const router = express.Router();
const User = require("../Models/User");


const { sendMessage, getChatHistory} = require("../controllers/chatController");

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

module.exports = router;   