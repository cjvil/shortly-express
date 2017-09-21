const parseCookies = (req, res, next) => {
  console.log(req.headers.cookie);
  var cookie = req.headers.cookie;

  // req.cookies = {cookie: cookie};
  
  if (!cookie) {
    console.log('no cookie found');
    req.cookies = {};
    // next();
  } else {
    req.cookies = {cookie: cookie};
  }
};

module.exports = parseCookies;