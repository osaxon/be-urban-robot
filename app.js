const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);

module.exports = app;
