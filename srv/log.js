/**
 * Created by matan on 28/02/17.
 */

'use strict';

const winston = require('winston');

module.exports.log = new winston.Logger({
  transports: [
    new winston.transports.Console({colorize: true})
  ]
});