/**
 * Initializing Environment Variable
 */
require('dotenv').config();
const { SELECT_LIMIT } = process.env;

/**
 * Express Router Set
 */
const express = require("express");

/**
 * Validation Handler
 */
const { check, validationResult } = require('express-validator');

/**
 * Query List
 */
const queryBox = require('../Database/Queries.json');

/**
 * Query Execuator
 */
const queryExecuator = require('../Database/QueryExe'),
    Exe = new queryExecuator()

/**
 * Error Logger Component
 */
const { Error } = require('../Config/Logs');

// Extracting Middleware
const isLoggedIn = require('../Middlewares/isLoggedIn');

// Extracting Access handler
const AllowAccess = require('../Middlewares/AccessHandler');

/**
 * Route and Validator Export
 * 
 * Made with ❤️ by Dibesh Raj Subedi
 * 
 * Contributors : 
 * 
 * @description Export Http Requirements
 */
module.exports = { express, check, validationResult, queryBox, Exe, Error, isLoggedIn, AllowAccess, SELECT_LIMIT }