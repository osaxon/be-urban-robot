const express = require("express");
const {
    getTopics,
    getTopicBySlug,
} = require("../controllers/topics.controllers");

const router = express.Router();

router.get("/", getTopics);
router.get("/:slug", getTopicBySlug);

module.exports = router;
