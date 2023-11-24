const express = require("express");
const router = express.Router();
const {
    getArticles,
    getArticleByID,
    getArticleComments,
    patchArticle,
    postArticle,
} = require("../controllers/articles.controllers");
const { postComment } = require("../controllers/comments.controllers");

router.get("/", getArticles);
router.post("/", postArticle);
router.get("/:article_id", getArticleByID);
router.get("/:article_id/comments", getArticleComments);
router.post("/:article_id/comments", postComment);
router.patch("/:article_id", patchArticle);

module.exports = router;
