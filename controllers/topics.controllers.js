const { selectTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch((error) => {
            next(error);
        });
};
