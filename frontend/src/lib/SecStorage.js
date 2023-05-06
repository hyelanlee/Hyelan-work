import SecureStorage from 'secure-web-storage';
import CryptoJS from 'crypto-js';

const SecStorage = function SecStorage(SCK) {
  const secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key) {
      key = CryptoJS.SHA256(key, SCK);
      return key.toString();
    },
    encrypt: function encrypt(data) {
      data = CryptoJS.AES.encrypt(data, SCK);
      data = data.toString();
      return data;
    },
    decrypt: function decrypt(data) {
      data = CryptoJS.AES.decrypt(data, SCK);
      data = data.toString(CryptoJS.enc.Utf8);
      return data;
    },
  });
  return secureStorage;
};

export default SecStorage;
