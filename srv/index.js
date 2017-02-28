/**
 * Created by matan on 25/02/17.
 */

const config = require('config').get('app');

const express = require('express');
const app = express();

const { log } = require('./log');

const { getRouter } = require('./api');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { connect } = require('./db');
const morgan = require('morgan');

async function initExpressApp() {
  app.use(morgan('combined', { stream: {write: log.info}}));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));

  const client = await connect();
  app.use(session({
    secret: config.secret,
    cookie: {
      domain: config.domain
    },
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({db: client})
  }));

  const api = await getRouter(client);
  app.use('/api', api);
  app.use((req, res) => {
    res.status(404).send({err: 'Not found'});
  })

  app.listen(config.port);
  log.info(`App listening on port ${config.port}`);
}

initExpressApp().catch(log.error);
