const express = require("express");
const {
  improveTextController,
} = require("../controllers/improveTextController");

const aiRouter = express.Router();

aiRouter.post("/improve-text", improveTextController);

module.exports = aiRouter;
