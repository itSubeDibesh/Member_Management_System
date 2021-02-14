const express = require("express"),
    router = express.Router();
const { check, validationResult } = require('express-validator');

/**
 * Route and Validator Export
 * 
 * Made with ❤️ by Dibesh Raj Subedi
 * 
 * Contributors : 
 * 
 * @description Sets a exporter express router and validator as well
 */
module.exports = { router, check, validationResult }