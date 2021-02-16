require("dotenv").config();
const { Exe, Error } = require('../Config/Http');
const { SELECT_LIMIT } = process.env;

/**
 * Paginates Data
 * @param {url} base_url 
 * @param {url} current_page 
 * @param {number} page 
 * @param {string} sqlQuery 
 * @param {any} params 
 * @param {number} total_length 
 * @param {function} callback 
 */
function paginate(base_url, current_url, page, sqlQuery, params, total_length, callback) {
    // Check if page is not negetive
    if (page > 0) {
        Exe.queryExecuator(sqlQuery, params, (error, result) => {
            if (error != null) Error.log(error);
            if (result) {
                const length = result.length,
                    total_pages = Math.ceil(parseInt(total_length) / length),
                    limit = parseInt(SELECT_LIMIT);
                if (page != null && page >= 1)
                    return callback({
                        response: {
                            success: true,
                            status: 200,
                            result,
                            elements_count: length,
                            total_elements_count: total_length,
                            limit,
                            navigation: {
                                total_pages,
                                current_page_no: page,
                                previous_page: (page != 1 ? `${base_url}?page=${page - 1}` : null),
                                current_page: `${base_url}${current_url.replace('/', '')}`,
                                next_page: ((page != total_pages) ? `${base_url}?page=${page + 1}` : null),
                            }
                        }
                    });
                else return callback({
                    response: {
                        success: !1,
                        status: 404,
                        result: 'Not Found.'
                    }
                });
            } else return callback({ response: { success: !1, status: 404, result: 'Not Found.' } });
        });
    } else return callback({ response: { success: !1, status: 404, result: 'Not Found.' } });
}

/**
 * Returns count result
 * @param {string} sqlCountQuery 
 * @param {any} params 
 * @param {function} callback 
 */
function count(sqlCountQuery, params, callback) {
    Exe.queryExecuator(sqlCountQuery, params, (error, result) => {
        if (error != null) Error.log(error);
        if (result) return callback({ result: result[0] });
    });
}
module.exports = { paginate, count };