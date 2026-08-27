const express = require("express");
const router = express.Router();

const {registerUser , loginUser } = require("../controllers/authController");

router.get("/register" , (req , res) => {
  res.render("auth/register")
});
router.post("/register" , registerUser);


router.get("/login" ,(req , res) => {
    res.render("auth/login")
});
router.post("/login", loginUser);

module.exports = router ;
