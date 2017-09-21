const parseCookies = (req, res, next) => {
  console.log(req.headers.cookie);
  var cookie = req.headers.cookie;
  var cookieArr = [];
  var cookieObj = {};
  if (cookie) {
    cookieArr = cookie.split(';');
  }
  cookieArr.forEach((cookie) => {
    var tuple = cookie.split('=');
    var curKey = tuple[0].trim();
    var curVal = tuple[1].trim();
    cookieObj[curKey] = curVal;
  });
  req.cookies = cookieObj;
  next();
};

module.exports = parseCookies;