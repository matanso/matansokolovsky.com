/**
 * Created by matan on 28/02/17.
 */

'use strict';

const { Router } = require('express');
const { version } = require('config').get('api');
const { setupAuth } = require('./auth');
const { log } = require('../log');

async function getRouter(client) {
  const router = Router();
  router.get('/version', (req, res) => res.status(200).send({ version }));
  setupAuth(client, router);
  router.use((req, res, next) => {
    log.info(`Session is ${JSON.stringify(req.session)}`);
    next();
  })
  router.get('/user', (req, res) => res.status(200).send(req.user));
  return router;
}

module.exports = { getRouter };