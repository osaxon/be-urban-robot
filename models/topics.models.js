const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = (slug) => {
    let queryString = `SELECT slug, description FROM topics`;
    if (slug) {
        queryString += format(` WHERE slug = %L`, slug);
    }
    return db.query(queryString).then(({ rows, rowCount }) => {
        return rows;
    });
};
