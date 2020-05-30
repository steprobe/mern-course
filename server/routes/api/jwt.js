const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('config');

function respondWithJwtForUser(res, user) {
  const payload = { user: { id: user.id } };

  jwt.sign(
    payload,
    config.get('jwtSecret'),
    { expiresIn: '5 days' },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
}

module.exports = respondWithJwtForUser;
