const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  console.log('inside session parser');

  if (!req.cookies) {
    models.Session.create()
    .then(() => {
      res.end();
    });
  } else {
    res.end();
  }
  
  // .then(() => {
  //   res.end();
  // });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

