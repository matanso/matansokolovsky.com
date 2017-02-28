/**
 * Created by matan on 28/02/17.
 */

'use strict'

const { User } = require('../db');
const { log } = require('../log');
const { ObjectId } = require('mongodb');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function setupPassport (client) {
  passport.use(new LocalStrategy(
    async function (username, password, cb) {
      try {
        const user = await User.find(client, username, password);
        if (user) cb(null, user);
        else cb(null, false)
      } catch (e) {
        cb(e);
      }
    }));

  passport.serializeUser(function (user, cb) {
    log.info(`Serializing user ${user.username}`);
    cb(null, user._id.toHexString())
  });

  passport.deserializeUser(async function (_id, cb) {
    log.info(`Attempting to deserialize user with id ${_id}`);
    try {
      const user = await User.findById(client, ObjectId.createFromHexString(_id));
      if (user) {
        log.info(`Successfully deserialized user ${user.username}`);
        cb(null, user);
      }
      else cb(null, false);
    }
    catch (e) {
      cb(e);
    }
  });
}

function setupAuth (client, app) {
  setupPassport(client);

  app.use(passport.initialize())
  app.use(passport.session())

  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
    log.info(`User ${req.user.username} logged in successfully`);
      res.redirect('/');
    });

  app.post('/logout',
    (req, res) => {
      req.logout();
      res.redirect('/');
    });

  app.post('/register', async ({ body: { username, password } }, res, next) => {
      try {
        const result = await User.register(client, username, password);
        if (result) next();
        else res.status(200).send({ err: 'Username is already taken' });
      }
      catch (e) {
        // todo log err
        res.status(500).send();
      }
    },
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/'));
}

module.exports = {
  setupAuth
};