const express = require("express");
const router = express.Router();

const { signup, activateAccount, login } = require("../controllers/auth");
const {
  userSignupValidator,
  userLoginValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/activate-account", activateAccount);
router.post("/login", userLoginValidator, runValidation, login);

module.exports = router;
