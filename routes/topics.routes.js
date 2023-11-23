const express = require("express");
const { getTopics } = require("../controllers/topics.controllers");

const router = express.Router();

router.get("/", getTopics);

module.exports = router;
