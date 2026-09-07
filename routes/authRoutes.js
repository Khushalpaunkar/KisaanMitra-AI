const express = require("express");
const router = express.Router();

const {registerUser , loginUser, logoutUser, getSafeReturnTo } = require("../controllers/authController");

router.get("/register" , (req , res) => {
  res.render("auth/register");
});
router.post("/register" , registerUser);


router.get("/login" ,(req , res) => {
  res.render("auth/login", {
    returnTo: getSafeReturnTo(req.query.returnTo)
  });
});

router.post("/login", loginUser );
router.get("/logout", logoutUser);

module.exports = router ;
