// Helpers
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isStrongPassword = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
};

// =======================
// REGISTER VALIDATION
// =======================
exports.validateRegister = (req, res, next) => {
  let { email, password, role } = req.body;

  email = email?.toLowerCase().trim();

  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Email, password and role are required"
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 chars and contain letters & numbers"
    });
  }

  // overwrite normalized email
  req.body.email = email;

  next();
};

// =======================
// LOGIN VALIDATION
// =======================
exports.validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  email = email?.toLowerCase().trim();

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  req.body.email = email;

  next();
};