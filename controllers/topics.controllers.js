const { selectTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
    console.log("get topics controller");
    selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch((error) => {
            next(error);
        });
};
