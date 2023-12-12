const { readEndpointsFile } = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
    readEndpointsFile()
        .then((file) => {
            res.status(200).send(file);
        })
        .catch((error) => next(error));
};

exports.getNewCoverImage = (req, res, next) => {
    const { topic } = req.query;
    console.log("get new cover image controller");

    fetch(`https://api.pexels.com/v1/search?query=${topic}&per_page=3`, {
        method: "GET",
        headers: {
            Authorization: process.env.PEXELS_API_KEY,
        },
    })
        .then((data) => {
            console.log(data, "<---- the data");
            return data.json();
        })
        .then(({ photos }) => res.status(200).send({ photos }))
        .catch(next);
};
