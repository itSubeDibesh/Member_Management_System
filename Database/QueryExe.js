/**
 * MySql Database Connector - @version 1
 * 
 * Made with ❤️ by Dibesh Raj Subedi
 * 
 * Contributors : 
 * 
 * @description Exports the mysql_database module to connect with mysql database.
 */

const
    sql = require('mysql'),
    { Error, Query } = require("../Config/Logs");

// Initializing Environment Variable
require("dotenv").config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env,
    database_exists = `SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "${DB_NAME}";`;

let
    sql_con_obj = {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD || null,
        database: DB_NAME
    },
    sql_connection = sql.createConnection(sql_con_obj);

const
/**
 * Checks if Database exists of not and returns callback
 * @param {function} callback -> returns true or false is no error
 */
    db_exists = (callback) => {
    // Logs Execuated Queries
    Query.log(`Request : [${database_exists}]`);
    sql_connection.query(database_exists, (err, res) => {
        if (err) {
            if (err.code == "ECONNREFUSED")
                Error.log('Error querying: MySQL refused connection.');
            else
                Error.log(err.stack);
        } else {
            if (res.length == 0)
                return callback({ result: false })
            else
                return callback({ result: res[0].SCHEMA_NAME == DB_NAME });
        }
    });
};

module.exports = class mysql_database {
    constructor() {
        this.connection.connect((err) => {
            // Setting thread for debig logs
            this.thread_ID = this.connection.threadId;
            if (this.connection.state == 'connected')
                if (err) Error.log(err.stack);
                else {
                    if (err)
                        if (err.code == "ECONNREFUSED")
                            Error.log('Error connecting: MySQL Server resufed connection.');
                }
        });

        // Create new database if database doesnt exists
        db_exists((callback) => {
            if (callback.result)
                sql_connection = sql.createConnection(sql_con_obj.database = DB_NAME);
            else Error.log('Database Not Found.')
        });
    }

    // Creates a new mysql connection
    connection = sql_connection;

    /**
     * Query Execuator
     * @param {string} query 
     * @param {any} params > String , Array or object
     * @param {function} callback 
     */
    queryExecuator(query, params, callback) {
        let execuated = this.connection.query(query, params || null, callback);
        Query.log(`Request : [${execuated.sql}]`);
    }
}