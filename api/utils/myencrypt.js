var CryptoJS = require("crypto-js");
const ENC_KEY = process.env.ENC_KEY;


module.exports = {


  encrypt: function (val) {
    let ciphertext = CryptoJS.AES.encrypt(val, ENC_KEY).toString();
    return ciphertext;
  },

  decrypt: function (val) {    
    var bytes  = CryptoJS.AES.decrypt(val, ENC_KEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  },


  encrypt_obj: function (obj) {
    
    let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), ENC_KEY).toString();
    ///var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), ENC_KEY).toString();
    return ciphertext;
  },


  decrypt_obj: function (val) {
    var bytes  = CryptoJS.AES.decrypt(val, ENC_KEY);
    var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return originalText;
  },





};


