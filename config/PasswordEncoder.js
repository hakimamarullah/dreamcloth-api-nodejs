const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config();

const passphrase = process.env.PASSPHRASE;
const encryptAES = (message) => {
  return CryptoJS.AES.encrypt(message, passphrase);
};

const decryptAES = (message) => {
  return CryptoJS.AES.decrypt(message, passphrase);
};

module.exports = { encryptAES, decryptAES };
