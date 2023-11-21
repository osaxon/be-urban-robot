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
const { postComment } = require("./controllers/comments.controllers");
const { userRoutes } = require("./routes");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);

app.use("/api/users", userRoutes);

app.use(psqlErrorHandler);
app.use(customErrorHandler);

module.exports = app;
