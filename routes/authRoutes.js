const express = require("express");
const router = express.Router();

const { login, register, getMe } = require("../Controllers/authController.js");
const {validateRegister,validateLogin}=require("../middleware/ValidateAuth.js");
const protect = require("../middleware/authMiddleware.js");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Get current user
router.get("/me", protect, getMe);

module.exports = router;