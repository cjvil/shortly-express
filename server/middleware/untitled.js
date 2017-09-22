const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
    .then((result) => {
      return models.Sessions.get({id: result.insertId});
    })
    .then((session) => {
      res.cookies = {
        shortlyid: {value: session.hash}
      };  
      req.session = session;
      req.session.user = {};
      req.session.user.username = req.body.username;
      next();
    })
    .catch((err) => {
      console.log('FAIL at no cookies', err);
    });
  } else {
    models.Sessions.get({ hash: req.cookies.shortlyid })
    .then((session) => {
      req.session = session;
      return models.Users.get({ id: session.userId });
    })
    .then((user) => {
      req.session.user = {};
      req.session.user.username = user.username;
      next();
    })
    .catch((err) => {
      console.log('FAIL with cookies', err);
    });
  }  
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

