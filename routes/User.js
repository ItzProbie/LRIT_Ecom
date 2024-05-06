const express = require("express");
const router = express.Router();

const { generateResetPasswordToken, resetPassword } = require("../controllers/User");

router.post("/reset-password-token" , generateResetPasswordToken);
router.post("/changePassword" , resetPassword);

module.exports = router;