import {AESDecrypt, AESEncrypt} from "./Crypto-Helper";

const UserProfile = function () {
  // eslint-disable-next-line camelcase
  let full_name = "";

  const getName = function() {
    let keys;
    keys = Object.keys(localStorage);
    let len;
    len = keys.length;
    for(let i = 0; i < len; i++) {
      if(AESDecrypt(keys[i])==="name"){
        // eslint-disable-next-line camelcase,max-len
        return AESDecrypt(keys[i])+AESDecrypt(localStorage.getItem(keys[i])); // Or pull this from cookie/localStorage
      }
    }
    return null;

  };

  const setName = function(name) {
    localStorage.setItem(AESEncrypt("name"), AESEncrypt(name));
    // eslint-disable-next-line camelcase
    full_name = name;
    // Also set this in cookie/localStorage
  };

  return {
    getName: getName,
    setName: setName
  };

}();

export default UserProfile;
