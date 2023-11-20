const { selectArticles } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
    console.log("get articles controller");
    selectArticles()
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};
