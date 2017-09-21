const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  console.log('inside session parser');
  models.Session.create()
  .then(() => {
    res.end();
  });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

