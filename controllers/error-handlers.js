exports.psqlErrorHandler = (err, req, res, next) => {
    switch (err.code) {
        case "23502":
        case "22P02":
        case "42703":
            res.status(400).send({ msg: "bad request" });
        default:
            next(err);
    }
};

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.message });
    } else {
        next(err);
    }
};
