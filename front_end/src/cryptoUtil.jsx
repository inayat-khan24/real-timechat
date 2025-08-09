// src/utils/cryptoUtil.js
import CryptoJS from "crypto-js";

// For real apps, use a per-chat unique key and securely exchange it
const ENCRYPTION_KEY = "super-secret-key";

export const encryptMessage = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decryptMessage = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
