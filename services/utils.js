import bcrypt from 'bcrypt';
import cryptoJS from 'crypto-js';
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};


export const encrypt = (text, key) => cryptoJS.AES.encrypt(text, key).toString();

export const decrypt = (ciphertext, key) => {
  const bytes = cryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(cryptoJS.enc.Utf8);
}

export default {
  encrypt,
  decrypt,
}



