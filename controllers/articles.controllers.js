const {
    selectArticles,
    selectArticleByID,
    selectArticleComments,
    updateArticle,
} = require("../models/articles.models");
const { checkExists, checkColumnExists } = require("../models/utils");

exports.getArticles = (req, res, next) => {
    const articlePromises = [];
    const queries = req.query;

    articlePromises.push(selectArticles(queries));

    if (queries.topic) {
        articlePromises.push(checkExists("topics", "slug", queries.topic));
    }

    if (queries.order) {
        if (queries.order !== "desc" && queries.order !== "asc") {
            next({
                status: 400,
                message: "bad request",
            });
        }
    }

    Promise.all(articlePromises)
        .then(([articles, topicCheck]) => {
            res.status(200).send({ articles });
        })
        .catch((error) => {
            console.log(error, "<--- the error");
            next(error);
        });
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

exports.patchArticle = (req, res, next) => {
    const { article_id: id } = req.params;
    const newVotes = req.body;

    if (!newVotes || !newVotes.inc_votes || isNaN(newVotes.inc_votes)) {
        next({
            status: 400,
            message: "bad request - invalid request body",
        });
    }

    const data = {
        id,
        newVotes,
    };

    Promise.all([
        checkExists("articles", "article_id", id),
        updateArticle(data),
    ])
        .then(([articleCheck, article]) => {
            res.status(200).send({ article });
        })
        .catch(next);
};
