const { selectTopics } = require("../models/topics.models");
const { checkExists } = require("../models/utils");

exports.getTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch((error) => {
            next(error);
        });
};

exports.getTopicBySlug = (req, res, next) => {
    const { slug } = req.params;
    console.log(slug, "<--- slug in the controller");
    Promise.all([checkExists("topics", "slug", slug), selectTopics(slug)])
        .then(([topicCheck, topic]) => {
            console.log(topic, "<--- topic in the controller");
            res.status(200).send({ topic: topic[0] });
        })
        .catch((error) => {
            console.log(error, "<--- error in the controller");
            next(error);
        });
};
