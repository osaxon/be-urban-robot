const express = require("express");
const router = express.Router();
const { deleteCommentByID } = require("../controllers/comments.controllers");

router.delete("/:comment_id", deleteCommentByID);

module.exports = router;
