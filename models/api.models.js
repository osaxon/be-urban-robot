const fs = require("fs/promises");
const path = require("path");

exports.readEndpointsFile = () => {
    return fs
        .readFile(path.join(__dirname, "../endpoints.json"))
        .then((data) => {
            const file = JSON.parse(data);
            return file;
        });
};
