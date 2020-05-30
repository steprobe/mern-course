const jwt = require('jsonwebtoken');
const config = require('config');
const failAuth = require('../util');

module.exports = function (req, res, next) {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return failAuth(res);
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;

    next();
  } catch (err) {
    return failAuth(res);
  }
};
