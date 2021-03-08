/**
 * Initializing Environment Variable
 */
require('dotenv').config();
const { SELECT_LIMIT } = process.env;

/**
 * Validation Handler
 */
const { check, validationResult } = require('express-validator');

/**
 * Query Execuator
 */
const queryExecuator = require('../Database/QueryExe');

/**
 * Error Logger Component
 */
const { Error } = require('../Config/Logs');

/**
 * Route and Validator Export
 * 
 * Made with ❤️ by Dibesh Raj Subedi
 * 
 * Contributors : 
 * 
 * @description Export Http Requirements
 */
module.exports = {
    /**
     * Express Router Set
     */
    express: require("express"),
    check,
    validationResult,
    /**
     * Query List
     */
    queryBox: require('../Database/Queries.json'),
    Exe: new queryExecuator(),
    Error,
    /**
     * Extracting Middleware
     */
    isLoggedIn: require('../Middlewares/isLoggedIn'),
    /**
     * Extracting Access handler
     */
    AllowAccess: require('../Middlewares/AccessHandler'),
    SELECT_LIMIT,
    /**
     * Bcrypt Module to handle encryption 
     */
    bcrypt: require('bcryptjs')
}