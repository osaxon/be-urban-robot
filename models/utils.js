const db = require("../db/connection");
const format = require("pg-format");

/**
 * Checks for the existence of a value in the database.
 *
 * @param {string} table - The table name in the db to be checked.
 * @param {string} column - The column name to lookup the value against.
 * @param {string} value - The value to lookup.
 * @returns {Promise} - A promise that resolves if the value exists in the specified column of the table,
and rejects with an object containing status code and message if the value is not found.
 */
exports.checkExists = (table, column, value) => {
    const queryString = format(
        `SELECT * FROM %I WHERE %I = $1;`,
        table,
        column
    );
    return db.query(queryString, [value]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({
                status: 404,
                message: `${column} not found`,
            });
        }
    });
};
