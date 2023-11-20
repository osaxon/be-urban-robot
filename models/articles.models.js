const db = require("../db/connection");

exports.selectArticleByID = (id) => {
    return db
        .query(
            `SELECT article_id, author, title, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1`,
            [id]
        )
        .then(({ rows: [article] }) => {
            return article;
        });
};
