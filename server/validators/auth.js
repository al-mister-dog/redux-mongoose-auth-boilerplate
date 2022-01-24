const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is Required"),
  check("email").not().isEmpty().isEmail().withMessage("Must be Valid Email"),
  check("password").isLength({min: 6}).withMessage("Password must be at least six characters")
  //will throw an error to be catched in index
];

exports.userLoginValidator = [
  check("email").not().isEmpty().isEmail().withMessage("Must be Valid Email"),
  check("password").isLength({min: 6}).withMessage("Password must be at least six characters")
  //will throw an error to be catched in index
];

