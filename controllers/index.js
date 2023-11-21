const { getUsers } = require("./users.controllers");
const {
    getArticles,
    getArticleByID,
    getArticleComments,
} = require("./articles.controllers");

module.exports = { getUsers, getArticles, getArticleByID, getArticleComments };
