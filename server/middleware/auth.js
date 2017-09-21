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

      next();
    });
  } else {
    req.session = {
      hash: req.cookies.shortlyid
    };
    next();
  }

  
  // .then(() => {
  //   res.end();
  // });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

