const { selectArticleByID } = require("../models/articles.models");

exports.getArticleByID = (req, res, next) => {
    const { article_id: id } = req.params;
    selectArticleByID(id)
        .then((article) => {
            res.status(200).send(article);
        })
        .catch((error) => next(error));
};
