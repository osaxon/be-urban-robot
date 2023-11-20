const db = require("../db/connection");

exports.selectArticles = () => {
    console.log("select articles model");
    return db
        .query(
            `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.author, articles.title, articles.article_id ORDER BY articles.created_at DESC;`
        )
        .then(({ rows }) => {
            return rows.map(({ comment_count, ...rest }) => ({
                ...rest,
                comment_count: +comment_count,
            }));
        });
};
