const fs = require("fs/promises");

exports.readEndpointsFile = () => {
    fs.readFile(`${__dirname}/../../endpoints.json`).then((data) => {
        console.log(data, "<---- file");
    });
};
