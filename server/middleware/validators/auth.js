const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is Required"),
  check("email").not().isEmpty().isEmail().withMessage("Must be Valid Email"),
  check("password")
    .notEmpty()
    .withMessage("Please type in password")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least six characters")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage("Password must contain a number")
];

exports.userLoginValidator = [
  check("email").not().isEmpty().isEmail().withMessage("Must be Valid Email"),
  check("password")
    .notEmpty()
    .withMessage("Please type in password")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least six characters")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage("Password must contain a number")
];

exports.forgotPasswordValidator = [
  check("email").not().isEmpty().isEmail().withMessage("Must be Valid Email")
];

exports.resetPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .withMessage("Please type in password")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least six characters")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage("Password must contain a number")
];