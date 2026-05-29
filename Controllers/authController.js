const { registerUser, loginUser } = require("../services/authService.js");
const generateToken = require("../utils/generateToken.js");

// =======================
// REGISTER
// =======================
exports.register = async (req, res, next) => {
  try {
    const { email, password, role, department } = req.body;

    const user = await registerUser({
      email,
      password,
      role,
      department
    });

    const userObj = { ...user };
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userObj
    });

  } catch (err) {
    next(err);
  }
};

// =======================
// LOGIN
// =======================
exports.login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

// =======================
// GET CURRENT USER
// =======================
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      data: req.user
    });

  } catch (err) {
    next(err);
  }
};