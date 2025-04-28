const { User } = require("../models");

// Securely check user's role using the middleware
const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const userEmail = req.user.email;
      const user = await User.findOne({ where: { email: userEmail } });

      if (!user || user.role !== role) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = checkRole;
