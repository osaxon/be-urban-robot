const express = require("express");
const cors = require("cors");
const {
    customErrorHandler,
    psqlErrorHandler,
} = require("./controllers/error-handlers");
const { getEndpoints } = require("./controllers/api.controllers");
const {
    userRoutes,
    articleRoutes,
    commentRoutes,
    topicRoutes,
} = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api", getEndpoints);

app.use("/api/topics", topicRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.use(psqlErrorHandler);
app.use(customErrorHandler);

module.exports = app;
