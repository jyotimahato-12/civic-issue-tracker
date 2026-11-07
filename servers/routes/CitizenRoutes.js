const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
} = require("../Controllers/userController");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;