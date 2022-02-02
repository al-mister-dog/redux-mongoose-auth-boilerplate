const expressJwt = require("express-jwt");
const User = require("../models/user");

exports.requireLogin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
}); //adds user property to request object

exports.adminAuth = (req, res, next) => {
  User.findById(req.user._id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(400).json({ error: "Admin access resource denied" });
    }
    req.profile = user;
    next();
  });
};
