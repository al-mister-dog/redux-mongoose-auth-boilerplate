const User = require("../models/user");
exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

exports.update = (req, res) => {
  console.log({ updateUser: req.user, updateData: req.body });
  const userId = req.params.id;
  User.updateOne({});
};
