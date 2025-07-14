const { body } = require("express-validator");

exports.registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

exports.loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").exists().withMessage("Password is required"),
];
