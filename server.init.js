// Dependencies Requirement
// const dashboard_monitor = require('appmetrics-dash');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const expressHandleBars = require('express-handlebars');

// Custome Logger
const { Request, Error } = require('./Config/Logs');
const Request_Logger = require('./Config/RequestLogger');

// Exported Routes Class
const WebRoutes = require('./Routes/webRoutes');
const session = require('express-session');

// Initialize Environment Variable
require('dotenv').config();

// Application Port
const { PORT, SECRET } = process.env;

// Create New Application Instance To Utilize Express
const APP = express();

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

// Dissables X-Powered By
APP.disable('x-powered-by');

// Parse requests of content-type - application/x-www-form-urlencoded
APP.use(express.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
APP.use(express.json());

// Setting Assets 
APP.use(express.static('./Public'));

//  Log All Requests
new Request_Logger(APP, Request, Error);

//#region HandleBars Configuration Start
APP.engine('handlebars', expressHandleBars());
APP.set('view engine', 'handlebars');
//#endregion

// Set Routes And Endoints Extractor here
new WebRoutes(APP);

// The 404 Route (ALWAYS Keep this as the last route)
APP.get('*', function(_request, _response) {
    return _response.status(404).send({ status: !1, status_code: 404, response: 'Page not found' });
});

//  Listen to The Port
APP.listen(PORT, console.log(`Website Url : http://localhost:${PORT}`));