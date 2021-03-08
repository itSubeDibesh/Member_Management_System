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
    { Error, Query } = require("../Config/Logs"),
    fs = require('fs'),
    /**
     * Mysql Dump modul to backup and restore database module
     */
    mysqldump = require('mysqldump'),
    /**
     * Schedule events
     */
    schedule = require('node-schedule');

// Initializing Environment Variable
require("dotenv").config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DUMP_DIRECTORY, BACKUP_SCHEDULE_HOUR, BACKUP_SCHEDULE_MINUTE, COMPRESS_FILE } = process.env,
    database_exists = `SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "${DB_NAME}";`;

let
    sql_con_obj = {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD || null,
        database: DB_NAME,
        multipleStatements: true
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

/**
 * Backup Database Actual Code
 * @param {string} dumpToFile ->File Path
 * @returns boolean True || False
 */
function backupDatabase(dumpToFile) {
    try {
        // Dumping the sql to file 
        mysqldump({
            connection: {
                host: DB_HOST,
                port: DB_PORT,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_NAME,
            },
            dumpToFile
        });
        return true;
    } catch (error) {
        Error.log(error);
        return false;
    }
}

/**
 * Returns Current Datetime code
 */
function getCurrentDateTimeCode() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const hours = formatHrShow(today.getHours());
    var time = hours + '-' + today.getMinutes() + '-' + today.getSeconds();
    return `OF_${date}_AT_${time}${(hours < 12 ? "AM" : "PM")}`;
}

/**
 * Converts 24 hr to 12 hr
 * @param {number} h_24 
 * @returns number
 */
function formatHrShow(h_24) {
    let hours = parseInt(h_24) % 12;
    if (hours === 0) hours = 12;
    return parseInt((hours < 10 ? '0' : '') + hours);
}


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


    /**
     * Triggers Database Backups
     * @returns {boolean} True || False
     */
    setDatabaseBackup() {
        // Compress the file
        const compressFile = COMPRESS_FILE.toLowerCase() == "true" ? true : false;
        let compressExtension = '.sql';
        // Appending .gz extension if compression mode is set to true
        if (compressFile) compressExtension += ".gz";
        // Generate File Name
        const dumpToFile = `./${DUMP_DIRECTORY || "BACKUP"}/BACKUP_${getCurrentDateTimeCode()}${compressExtension}`;
        // Create Directory if not exists
        if (!fs.existsSync(`./${DUMP_DIRECTORY}`)) {
            fs.mkdirSync(`./${DUMP_DIRECTORY}`)
        }
        return backupDatabase(dumpToFile);
    }

    /**
     * Schedules the Task Assigned according to the time in env file
     * @param {function} task 
     */
    scheduleTask(task) {
        // Creating Schedule Rule
        const ScheduleRule = new schedule.RecurrenceRule();
        // ScheduleRule.hour = parseInt(BACKUP_SCHEDULE_HOUR);
        ScheduleRule.second = parseInt(BACKUP_SCHEDULE_MINUTE);

        // Creating a Recurrent Job
        try {
            schedule.scheduleJob(ScheduleRule, task);
        } catch (error) {
            Error.log(error);
            // Send Email As Well
            console.log("Send An Email as Schequler fail");
        }
    }

}