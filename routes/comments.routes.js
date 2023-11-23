const express = require("express");
const router = express.Router();
const {
    deleteCommentByID,
    patchComment,
} = require("../controllers/comments.controllers");

router.delete("/:comment_id", deleteCommentByID);
router.patch("/:comment_id", patchComment);

module.exports = router;
