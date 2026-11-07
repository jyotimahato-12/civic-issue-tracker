const User = require("../models/AuthCiti.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper: Fast built-in/standard regex validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Registers a new enterprise user
 * @param {Object} userData 
 * @returns {Promise<Object>} Redacted user profile
 */
exports.registerUser = async (userData) => {
  const { name, email, password, role, department } = userData;

  // 1. Fail-fast input validation
  if (!name || !email || !password) {
    throw new Error("BAD_REQUEST: Name, email, and password are required");
  }

  if (!isValidEmail(email)) {
    throw new Error("BAD_REQUEST: Invalid email format");
  }

  if (password.length < 8) { // Upgraded to 8 characters for enterprise security compliance
    throw new Error("BAD_REQUEST: Password must be at least 8 characters");
  }

  // 2. Normalize inputs
  const normalizedEmail = email.trim().toLowerCase();

  // 3. Uniqueness Check (Optimized via Email Index)
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("CONFLICT: User with this email already exists");
  }

  // 4. Secure Hashing (Salt rounds = 12 is optimal balance for performance/security)
  const hashedPassword = await bcrypt.hash(password, 12);

  // 5. Persistence
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    department
  });

  // 6. Security Sanitization (Never return the password hash)
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department
  };
};

/**
 * Authenticates a user and generates an access token
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Token and user metadata
 */
exports.loginUser = async (email, password) => {
  // 1. Validation
  if (!email || !password) {
    throw new Error("BAD_REQUEST: Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 2. Fetch User (Lightning fast due to Index)
  const user = await User.findOne({ email: normalizedEmail });

  // 3. Constant-Time/Generic Error Mitigation (Prevents User Enumeration Attacks)
  if (!user) {
    throw new Error("UNAUTHORIZED: Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("UNAUTHORIZED: Invalid credentials");
  }

  // 4. Token Generation (Fails safely if environment variables are missing)
  if (!process.env.JWT_SECRET) {
    throw new Error("INTERNAL_SERVER_ERROR: Authentication configuration missing");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role // Included role for RBAC (Role-Based Access Control)
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d" // Configurable expiration
    }
  );

  return {
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    },
    token
  };
};