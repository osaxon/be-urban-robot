const {
    insertComment,
    deleteComment,
    updateComment,
} = require("../models/comments.models");
const { checkExists } = require("../models/utils");

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (!username || !body) {
        next({
            status: 400,
            message: "bad request - invalid parameters for comment body",
        });
    }

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

exports.deleteCommentByID = (req, res, next) => {
    const { comment_id } = req.params;
    Promise.all([
        checkExists("comments", "comment_id", comment_id),
        deleteComment(comment_id),
    ])
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    console.log("patch comment controller");

    Promise.all([
        checkExists("comments", "comment_id", comment_id),
        updateComment(comment_id, inc_votes),
    ])
        .then(([idCheck, comment]) => {
            res.status(200).send({ comment });
        })
        .catch(next);
};
