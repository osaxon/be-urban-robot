const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (queries) => {
    let { topic, sort_by, order, limit, p } = queries;
    const queryKeys = Object.keys(queries);

    let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id `;

    const params = [];

    if (topic) {
        queryString += `WHERE topic = $1 `;
        params.push(topic);
    }

    queryString += format(
        `GROUP BY articles.author, articles.title, articles.article_id ORDER BY %I %s`,
        sort_by ?? "created_at",
        order ?? "DESC"
    );

    // checks if limit is passed as query and checks if the value can be converted to a number safely
    if (queryKeys.includes("p") || queryKeys.includes("limit")) {
        // reject if passed a value that can't be converted to a number - helps prevent sql injection
        if (queryKeys.includes("limit")) {
            if (isNaN(limit)) {
                return Promise.reject({
                    status: 400,
                    message: "invalid limit value",
                });
            }
        }

        if (queryKeys.includes("p")) {
            if (isNaN(p)) {
                return Promise.reject({
                    status: 400,
                    message: "invalid page value",
                });
            }
        }

        let limitQuery = ` LIMIT `;
        if (!limit) {
            limitQuery += "10";
        } else if (!isNaN(limit)) {
            params.push(limit);
            limitQuery += `$${params.length}`;
        }
        queryString += format(`%s`, limitQuery);

        let offsetQuery = ` OFFSET `;
        if (!p) {
            offsetQuery += "0";
        } else if (!isNaN(p)) {
            const offset = p > 1 ? p * (limit || 10) - (limit || 10) : 0;
            params.push(offset);
            offsetQuery += `$${params.length}`;
        }

        queryString += format(`%s`, offsetQuery);
    }
    return db.query(queryString, params).then((response) => {
        const { rows, rowCount } = response;
        return rows.map(({ comment_count, ...rest }) => ({
            ...rest,
            comment_count: +comment_count,
        }));
    });
};

exports.getTotalRowCount = (queries) => {
    let { topic } = queries;

    let queryString = `SELECT COUNT(*) AS total_count FROM articles`;

    const params = [];

    if (topic) {
        queryString += ` WHERE topic = $1`;
        params.push(topic);
    }

    return db.query(queryString, params).then(({ rows: [{ total_count }] }) => {
        return total_count;
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

exports.createArticle = (article) => {
    const articleWithMetaData = {
        ...article,
        votes: 0,
    };

    const insertQuery = format(
        `INSERT INTO articles (%I) VALUES %L RETURNING articles.*, (SELECT COUNT(comments.article_id) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count;`,
        Object.keys(articleWithMetaData),
        [Object.values(articleWithMetaData)]
    );

    return db.query(insertQuery).then(({ rows: [article] }) => {
        return {
            ...article,
            comment_count: +article.comment_count,
        };
    });
};
