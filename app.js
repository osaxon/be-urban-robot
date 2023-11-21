const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
    customErrorHandler,
    psqlErrorHandler,
} = require("./controllers/error-handlers");
const { getEndpoints } = require("./controllers/api.controllers");
const {
    getArticles,
    getArticleByID,
    getArticleComments,
} = require("./controllers/articles.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.use(psqlErrorHandler);
app.use(customErrorHandler);

module.exports = app;
