const express = require("express");
const { getUsername, getUsers } = require("../controllers/users.controllers");

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUsername);

module.exports = router;
