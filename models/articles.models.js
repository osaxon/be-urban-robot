const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (queries) => {
    const { topic, sort_by } = queries;

    let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id `;

    const params = [];

    if (topic) {
        queryString += `WHERE topic = $1 `;
        params.push(topic);
    }

    if (sort_by) {
        queryString += format(
            `GROUP BY articles.author, articles.title, articles.article_id ORDER BY articles.%I DESC`,
            sort_by
        );
    } else {
        queryString += `GROUP BY articles.author, articles.title, articles.article_id ORDER BY articles.created_at DESC;`;
    }
    console.log(queryString);

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
            `SELECT articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
            [id]
        )
        .then(({ rows: [article], rowCount }) => {
            if (!rowCount) {
                return Promise.reject({
                    status: 404,
                    message: "article does not exist",
                });
            }

            return {
                ...article,
                comment_count: +article.comment_count,
            };
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
