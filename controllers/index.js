const { getUsers } = require("./users.controllers");
const {
    getArticles,
    getArticleByID,
    getArticleComments,
    patchArticle,
} = require("./articles.controllers");
const { postComment, deleteCommentByID } = require("./comments.controllers");
const { getTopics } = require("./topics.controllers");

module.exports = {
    getUsers,
    getArticles,
    getArticleByID,
    getArticleComments,
    patchArticle,
    postComment,
    deleteCommentByID,
    getTopics,
};
