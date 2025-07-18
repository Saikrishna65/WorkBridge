const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15m
  max: 100,
  message: "Too many requests, please try again later.",
});
