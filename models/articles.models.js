const db = require("../db/connection");

exports.selectArticles = () => {
    return db
        .query(
            `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.author, articles.title, articles.article_id ORDER BY articles.created_at DESC;`
        )
        .then(({ rows, rowCount }) => {
            return rows.map(({ comment_count, ...rest }) => ({
                ...rest,
                comment_count: +comment_count,
            }));
        });
};

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

exports.selectArticleComments = (id) => {
    return db
        .query(
            `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC;`,
            [id]
        )
        .then(({ rows, rowCount }) => {
            if (!rowCount)
                return Promise.reject({
                    status: 404,
                    message: "article does not exist",
                });
            return rows;
        });
};

exports.updateArticle = ({ id, newVotes }) => {
    return db
        .query(
            `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
            [newVotes.inc_votes, id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
