const db = require("../db/connection");

exports.selectArticleByID = (id) => {
    return db
        .query(
            `SELECT article_id, author, title, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1`,
            [id]
        )
        .then(({ rows: [article], rowCount }) => {
            if (!rowCount) {
                return Promise.reject({
                    status: 404,
                    message: "article does not exist",
                });
            }
            return article;
        });
};
