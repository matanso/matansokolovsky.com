/**
 * Created by matan on 28/02/17.
 */

'use strict';

const config = require('config').get('mongodb');
const mongoClient = require('mongodb').MongoClient;

function connect() {
  return mongoClient.connect(config.url);
}

module.exports = {
  connect
};