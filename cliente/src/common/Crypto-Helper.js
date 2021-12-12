/* eslint-disable */
var CryptoJS = require("crypto-js");

export function AESEncrypt(pureText) {
    const privateKey=`secret key 123`;
    var ciphertext = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(pureText), privateKey).toString());
    return ciphertext;
}

export function AESDecrypt(encryptedText) {
    const privateKey=`secret key 123`;
    var bytes  = CryptoJS.AES.decrypt(decodeURIComponent(encryptedText), privateKey);
    var decryptedData
    if((bytes.toString(CryptoJS.enc.Utf8)).length>0){
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    }else {
        decryptedData = "";
    }
    return decryptedData;

}