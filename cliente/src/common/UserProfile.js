import {AESDecrypt, AESEncrypt} from './Crypto-Helper';

const UserProfile = function() {
  const getName = function() {
    const keys = Object.keys(localStorage);
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      if (AESDecrypt(keys[i])==='name') {
        return AESDecrypt(keys[i])+AESDecrypt(localStorage.getItem(keys[i]));
        // Or pull this from cookie/localStorage
      }
    }
    return null;
  };

  const setName = function(name) {
    localStorage.setItem(AESEncrypt('name'), AESEncrypt(name));
  };

  return {
    getName: getName,
    setName: setName,
  };
}();

export default UserProfile;
