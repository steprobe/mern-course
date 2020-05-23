const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const normalize = require('normalize-url');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// @route POST api/users
// @desc Register user
// @access Public
router.post('/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    let {name, email, password} = req.body

    try {

      let user = await User.findOne({email});
      if (user) {
        return res.status(4000).json({
          errors: [{msg: 'User already exists'}]
        });
      }

      const avatar = normalize(gravatar.url(email, {
          s: '200', r: 'pg', d: 'mm'
        }), {forceHttps: true}
      );

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      user = new User({name, email, avatar, password})
      await user.save();

      const payload = {user: {id: user.id}};

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: '5 days'},
        (err, token) => {
          if (err) throw err;
          res.json({token})
        });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;