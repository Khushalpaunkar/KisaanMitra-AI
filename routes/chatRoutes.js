const express = require("express");
const router = express.Router();


const {sendMessage} = require("../controllers/chatController");


router.get("/" , (req , res) => {
  const isLoggedIn = !!req.session.userId;

  res.render("chatbot/chat" , {
    isLoggedIn
  });
});



//AI chat API 
router.post("/message" , sendMessage)
module.exports = router;