const express = require("express");
const router = express.Router();
const { loginUser, signupUser, forgotPassword, resetPassword } = require("../controllers/auth.controller");

// Login endpoint
router.post('/login', loginUser);

// Signup endpoint
router.post('/signup', signupUser);

// For requesting a password reset code
router.post('/forgot_password', forgotPassword);

// For resetting the password using the verification code
router.post('/reset_password', resetPassword);

module.exports = router;