const express = require("express");
const router = express.Router();

router.get("/" , (req , res) => {
  const isLoggedIn = !!req.session.userId;

  res.render("chatbot/chat" , {
    isLoggedIn
  });
});

module.exports = router;