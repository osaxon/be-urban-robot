const {
    selectArticles,
    selectArticleByID,
    selectArticleComments,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
    selectArticles()
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

exports.getArticleByID = (req, res, next) => {
    const { article_id: id } = req.params;
    selectArticleByID(id)
        .then((article) => {
            res.status(200).send(article);
        })
        .catch(next);
};

exports.getArticleComments = (req, res, next) => {
    const { article_id: id } = req.params;
    selectArticleComments(id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch(next);
};
