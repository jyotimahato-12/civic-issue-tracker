const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =======================
// HELPERS (validation)
// =======================
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// =======================
// REGISTER USER
// =======================
exports.registerUser = async (data) => {
  const { email, password } = data;

  // 🔐 Validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // ❌ check existing user
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  // 🔐 hash password (secure default)
  const hashed = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashed
  });

  // ❗ NEVER return password
  return {
    id: user._id,
    email: user.email
  };
};

// =======================
// LOGIN USER
// =======================
exports.loginUser = async (email, password) => {

  // 🔐 Validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  const user = await User.findOne({ email });

  // 🔐 avoid user enumeration attack
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  // 🔥 JWT TOKEN (secure production version)
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return {
    user: {
      id: user._id,
      email: user.email
    },
    token
  };
};