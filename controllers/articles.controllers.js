const {
    selectArticles,
    selectArticleByID,
    selectArticleComments,
} = require("../models/articles.models");
const { checkExists } = require("../models/utils");

exports.getArticles = (req, res, next) => {
    const articlePromises = [];
    const { topic } = req.query;

    articlePromises.push(selectArticles(topic));

    if (topic) {
        articlePromises.push(checkExists("topics", "slug", topic));
    }

    Promise.all(articlePromises)
        .then(([articles, topicCheck]) => {
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
