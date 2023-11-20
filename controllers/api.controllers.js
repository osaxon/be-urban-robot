const { readEndpointsFile } = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
    readEndpointsFile();
};
