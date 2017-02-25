/**
 * Created by matan on 25/02/17.
 */

const config = require('config').get('app');

const express = require('express');
const app = express();

app.get('/api/version', (req, res) => res.status(200).send({version: config.version}));

app.listen(config.port);
