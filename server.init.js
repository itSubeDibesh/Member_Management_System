// Dependencies Requirement
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
const expressHandleBars = require('express-handlebars');

// Custome Logger
const { Request, Error } = require('./Config/Logs');
const Request_Logger = require('./Config/RequestLogger');

// Exported Routes Class
const WebRoutes = require('./Routes/webRoutes');
const session = require('express-session');

// Query Execuator for database
const queryExecuator = require('./Database/QueryExe'),
    Exe = new queryExecuator();

// Importing Mailbox
const mailBox = require('./Config/Mailer');

// Initialize Environment Variable
require('dotenv').config();

// Application Port
const { PORT, SECRET } = process.env;

// Create New Application Instance To Utilize Express
const APP = express();

// Dissables X-Powered By
APP.disable('x-powered-by');

// Preventing from XSS
APP.use(xss())

// Handle Bar Helpers 
const handleBars = expressHandleBars.create({
    helpers: {
        ifEquals: function(a, b, options) {
            if (a === b) return options.fn(this);
            return options.inverse(this);
        },
        ifNotEquals: function(a, b, options) {
            if (a !== b) return options.fn(this);
            return options.inverse(this);
        },
        SN: function(value, options) {
            return parseInt(value + 1);
        },
        ToUpper: function(value, options) {
            return value.toString().toUpperCase();
        },
        ToFirstUpper: function(value, options) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        ParseDate: function(value, options) {
            let date = new Date(value),
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
        },
        RemovetUnderscore: function(value, options) {
            return value.replace("_", " ");
        }
    }
});

// Limmiting request rate limit
APP.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 500 // limit each IP to 100 requests per windowMs
}))

// Configuration Management
APP.use(helmet());

// Set Cros Options
APP.use(cors({
    origin: `http://localhost:${PORT}`,
}));

// Setting app Session
APP.use(session({
    secret: SECRET,
    resave: true,
    saveUninitialized: true
}))

// Parse requests of content-type - application/x-www-form-urlencoded
APP.use(express.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
APP.use(express.json());

// Setting Assets 
APP.use(express.static('./Public'));

//  Log All Requests
new Request_Logger(APP, Request, Error);

//#region HandleBars Configuration Start
APP.engine('handlebars', handleBars.engine);
APP.set('view engine', 'handlebars');
//#endregion

// Set Routes And Endoints Extractor here
new WebRoutes(APP);

// The 404 Route (ALWAYS Keep this as the last route)
APP.get('*', function(_request, _response) {
    // Set 404 Partial view
    return _response.status(404).send({ status: !1, status_code: 404, response: 'Page not found' });
});

//  Set Scheduler for backup purpose 
Exe.scheduleTask(() => {
    if (!Exe.setDatabaseBackup())
        mailBox(
            "Alert, Database Backup Failure!😔😔",
            `Hi there, Something went wrong in server so auto backup is not working as intended so need your attention ASAP!`,
            `<b>Hi there!<b><br><br> Something went wrong in server so auto backup is not working as intended so need your attention ASAP!<br>`
        )
});

//  Listen to The Port
APP.listen(PORT, console.log(`Website Url : http://localhost:${PORT}`));