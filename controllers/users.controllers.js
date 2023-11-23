const { selectUserByName, selectUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
    selectUsers()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
};

exports.getUsername = (req, res, next) => {
    const { username } = req.params;
    console.log(username);
    selectUserByName(username)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch(next);
};
