const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleByID } = require("./controllers/articles.controllers");
const {
    customErrorHandler,
    psqlErrorHandler,
} = require("./controllers/error-handlers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.use(psqlErrorHandler);
app.use(customErrorHandler);

module.exports = app;
