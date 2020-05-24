const expressValidator = require('express-validator')
const failAuth = require('../../util');
const respondWithJwtForUser = require('./jwt')
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route GET api/auth
// @desc Get user by token
// @access Private
router.get('/', auth, async (req, res) => {

  try {
    const user = await User.findById(req.user.id).select('name email avatar -_id');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

// @route POST api/auth
// @desc Get user by token
// @access Private
router.post('/', [
    expressValidator.check('email', 'email is required').isEmail(),
    expressValidator.check('password', 'Password is required').exists()
  ],
  async (req, res) => {

    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {

      const {email, password} = req.body;
      const user = await User.findOne({email});

      if (user && await bcrypt.compare(password, user.password)) {
        respondWithJwtForUser(res, user);
      } else {
        failAuth(res)
      }

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;