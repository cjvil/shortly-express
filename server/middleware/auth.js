const models = require('../models');
const crypto = require('../lib/hashUtils.js');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    console.log('no cookies found');

    models.Sessions.create()
      .then((result) => {
        return models.Sessions.get({id: result.insertId});
      })
      .then((session) => {
        res.cookies = {
          shortlyid: {value: session.hash}
        };

        req.session = {hash: session.hash};
        req.session.user = {};
        req.session.user.userId = session.userId;

        console.log(session);
        console.log(req.session);
        return models.Users.get({id: session.userId});      
      })
      .then((user) => {
        console.log('user: ', user);
        if (user) {
          req.session.user.username = user.username;
        } else {
          req.session.user.username = null;
        }

        next();
      })
      .catch((err) => {
        console.log('error', err);
      });
  } else {
    console.log('cookies found');

    // check if cookies on req are in database
    // if not
      // clear cookies
      // create new cookie and reassign to req
    models.Sessions.get({hash: req.cookies.shortlyid})
      .then((session) => {
        if (!session) {
          models.Sessions.create()
            .then((result) => {
              return models.Sessions.get({id: result.insertId});
            })
            .then((session) => {
              res.cookies = {
                shortlyid: {value: session.hash}
              };

              req.session = {hash: session.hash};
              req.session.user = {};
              req.session.user.userId = session.userId;

              console.log(session);
              console.log(req.session);
              return models.Users.get({id: session.userId});      
            })
            .then((user) => {
              console.log('user: ', user);
              if (user) {
                req.session.user.username = user.username;
              } else {
                req.session.user.username = null;
              }

              next();
            })
            .catch((err) => {
              console.log('error', err);
            });


        }
      });

    req.session = {
      hash: req.cookies.shortlyid,
      user: {}
    };

    // look up session by hash
    models.Sessions.get({hash: req.cookies.shortlyid})
      .then((session) => {
        req.session.userId = session.userId;
        if (session.user) {
          req.session.user.username = session.user.username;
          return models.Users.get({id: session.userId});
        } else {
          return {
            username: null,
            userId: null
          };
        }
      })
      .then((user) => {
        req.session.user.username = user.username;
        next();
      })
      .catch((err) => {
        console.log('error ', err);
      }); 
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

