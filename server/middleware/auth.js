const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // console.log('cookies: ', req.cookies);

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
        console.log(req.session); // this is fine, why not inside test?

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
    req.session = {
      hash: req.cookies.shortlyid,
      user: {}
    };


    // look up session by hash
    models.Sessions.get({hash: req.cookies.shortlyid})
      .then((session) => {
        console.log('inside promises', session);
        console.log(session.userId);
        req.session.user.userId = session.userId;
        console.log('session' + JSON.stringify(req.session));
        console.log(session.user.username);
        req.session.user.username = session.user.username;
        console.log(req.session.user);
        return models.Users.get({id: session.userId});
      })
      .then((user) => {
        console.log('returned user', user);
        req.session.user.username = user.username;
        next();
      }); 

    next();
  }

  
  // .then(() => {
  //   res.end();
  // });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

