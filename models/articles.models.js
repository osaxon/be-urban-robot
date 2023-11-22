const db = require("../db/connection");

exports.selectArticles = (topic) => {
    let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id `;

    if (topic) {
        queryString += `WHERE topic = $1 `;
    }

    queryString += `GROUP BY articles.author, articles.title, articles.article_id ORDER BY articles.created_at DESC;`;

    const params = topic ? [topic] : [];

    return db.query(queryString, params).then(({ rows, rowCount }) => {
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
