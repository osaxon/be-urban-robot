const db = require("../db/connection");

exports.selectUsers = () => {
    return db
        .query(`SELECT username, name, avatar_url FROM users;`)
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectUserByName = (name) => {
    return db
        .query(
            `SELECT username, name, avatar_url FROM users WHERE username = $1;`,
            [name]
        )
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({
                    status: 404,
                    message: "user not found",
                });
            } else {
                return rows[0];
            }
        });
};
