const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is set by protect middleware
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "Please log in first"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action"
      });
    }

    next();
  };
};

module.exports = restrictTo;