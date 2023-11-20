exports.psqlErrorHandler = (err, req, res, next) => {
    console.log("psql error handler");
    switch (err.code) {
        case "23502":
        case "22P02":
            res.status(400).send({ msg: "bad request" });
        default:
            next(err);
    }
};

exports.customErrorHandler = (err, req, res, next) => {
    console.log(err, "<--- custom error handler err");
    if (err.status) {
        res.status(err.status).send({ msg: err.message });
    } else {
        next(err);
    }
};
