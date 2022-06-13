const mongoose = require('mongoose');
const { encryptAES, decryptAES } = require('../config/PasswordEncoder');
const User = require('../models/User');
const CryptoJS = require('crypto-js')
const router = require('express').Router();

router.post('/register', async (req, res) => {
  const body = req.body;
  const newUser = new User({
    username: body.email.split('@')[0],
    email: body.email,
    password: encryptAES(body.password),
    phone: body.phone,
  });

  newUser
    .save(newUser)
    .then(async (user) => {
      const response = user.toObject();
      delete response.password;
      res.status(201).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/login', async (req, res) => {
  try {
    const timestamps = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const body = req.body;
    const user = await User.findOne({ username: body.username });
    if (!user) {
      return res
        .status(404)
        .json({
          message: 'User not found',
          code: 404,
          statusText: 'NOT_FOUND',
        });
    }

    const hashedPassword = decryptAES(user.password);
    const password = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (body.password !== password) {
      return res
        .status(403)
        .json({
          message: 'Wrong Password',
          code: 403,
          statusText: 'FORBIDDEN',
        });
    }

   return res
      .status(200)
      .json({ message: "You're logged in", timestamps: timestamps });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
