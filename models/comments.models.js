const db = require("../db/connection");
const format = require("pg-format");

exports.insertComment = ({ article_id, author, body }) => {
    const formattedData = [[+article_id, author, body]];
    const formattedQuery = format(
        `INSERT INTO comments (article_id, author, body) VALUES %L RETURNING *;`,
        formattedData
    );
    return db.query(formattedQuery).then(({ rows }) => {
        return rows[0];
    });
};
