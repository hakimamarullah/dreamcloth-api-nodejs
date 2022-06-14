const mongoose = require('mongoose');
const { encryptAES, decryptAES } = require('../config/PasswordEncoder');
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const validator = require('validator')

router.post('/register', async (req, res) => {
  const body = req.body;
  if(!validator.isEmail(body.email)) return res.status(400).json({ok:false, message:"Invalid Email Address"})
  const newUser = new User({
    username: body.email.split('@')[0],
    email: body.email,
    password: encryptAES(body.password),
    phone: body.phone,
  });

  newUser
    .save()
    .then(async (user) => {
      const { password, ...others } = user._doc;
      res.status(201).json(others);
    })
    .catch((err) => {
      if(err.code === 11000){
        return res.status(409).json({message: err.message.substring(7), code: err.code})
      }
      res.status(500).json({message:err.message, code: err.code});
    });
});

router.post('/login', async (req, res) => {
  try {
    const timestamps = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    const body = req.body;
    const user = await User.findOne({ username: body.username });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        code: 404,
        statusText: 'NOT_FOUND',
      });
    }

    const hashedPassword = decryptAES(user.password);
    const password = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (body.password !== password) {
      return res.status(403).json({
        message: 'Wrong Password',
        code: 403,
        statusText: 'FORBIDDEN',
      });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        username: user.username,
      },
      process.env.PASSPHRASE,
      { expiresIn: '2d' }
    );
    return res
      .status(200)
      .json({
        message: "You're logged in",
        id: user._id,
        username: user.username,
        accessToken: accessToken,
        timestamps: timestamps,
      });

  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
