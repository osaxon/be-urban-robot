const { insertComment } = require("../models/comments.models");
const { checkExists } = require("../models/utils");

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    const newComment = {
        article_id,
        author: username,
        body,
    };

    Promise.all([
        checkExists("users", "username", username),
        checkExists("articles", "article_id", article_id),
        insertComment(newComment),
    ])
        .then(([userCheck, articleIdCheck, comment]) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};
