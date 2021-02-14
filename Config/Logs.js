// Dependencies Requirement
const nodefslogger = require('nodefslogger'),
    // Logger Instance
    Error = new nodefslogger('Error'),
    Query = new nodefslogger('Query'),
    Request = new nodefslogger('Request');
// Modules Export
module.exports = { Error, Query, Request }