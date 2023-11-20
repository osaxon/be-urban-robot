const { readEndpointsFile } = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
    readEndpointsFile()
        .then((file) => {
            res.status(200).send(file);
        })
        .catch((error) => next(error));
};
