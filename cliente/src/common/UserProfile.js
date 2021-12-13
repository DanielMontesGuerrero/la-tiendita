import {AESDecrypt, AESEncrypt} from "./Crypto-Helper";

const UserProfile = function () {
  // eslint-disable-next-line camelcase
  let full_name = "";
  let email = "";
  let id_school = null;
  let id_user = null;
  let image = null;
  let userType = "";

  const getName = function() {
    let keys;
    keys = Object.keys(localStorage);
    let len;
    len = keys.length;
    for(let i = 0; i < len; i++) {
      if(AESDecrypt(keys[i])==="name"){
        // eslint-disable-next-line camelcase,max-len
        return AESDecrypt(localStorage.getItem(keys[i])); // Or pull this from cookie/localStorage
      }
    }
    return null;

  };

  const getEmail = function() {
     let keys;
    keys = Object.keys(localStorage);
    let len;
    len = keys.length;
    for(let i = 0; i < len; i++) {
      if(AESDecrypt(keys[i])==="email"){
        // eslint-disable-next-line camelcase,max-len
        return AESDecrypt(localStorage.getItem(keys[i])); // Or pull this from cookie/localStorage
      }
    }
    return null;
  }
  const getIdSchool = function() {
     let keys;
    keys = Object.keys(localStorage);
    let len;
    len = keys.length;
    for(let i = 0; i < len; i++) {
      if(AESDecrypt(keys[i])==="id_school"){
        // eslint-disable-next-line camelcase,max-len
        return AESDecrypt(localStorage.getItem(keys[i])); // Or pull this from cookie/localStorage
      }
    }
    return null;
  }
  const getIdUser = function() {
     let keys;
    keys = Object.keys(localStorage);
    let len;
    len = keys.length;
    for(let i = 0; i < len; i++) {
      if(AESDecrypt(keys[i])==="id_user"){
        // eslint-disable-next-line camelcase,max-len
        return AESDecrypt(localStorage.getItem(keys[i])); // Or pull this from cookie/localStorage
      }
    }
    return null;
  }
  const getImage = function() {
     let keys;
    keys = Object.keys(localStorage);
    let len;
    len = keys.length;
    for(let i = 0; i < len; i++) {
      if(AESDecrypt(keys[i])==="image"){
        // eslint-disable-next-line camelcase,max-len
        return AESDecrypt(localStorage.getItem(keys[i])); // Or pull this from cookie/localStorage
      }
    }
    return null;
  }
  const getUserType = function() {
     let keys;
    keys = Object.keys(localStorage);
    let len;
    len = keys.length;
    for(let i = 0; i < len; i++) {
      if(AESDecrypt(keys[i])==="userType"){
        // eslint-disable-next-line camelcase,max-len
        return AESDecrypt(localStorage.getItem(keys[i])); // Or pull this from cookie/localStorage
      }
    }
    return null;
  }

  const setName = function(name) {
    localStorage.setItem(AESEncrypt("name"), AESEncrypt(name));
    // eslint-disable-next-line camelcase
    full_name = name;
    // Also set this in cookie/localStorage
  };
  const setEmail = function(data) {
    localStorage.setItem(AESEncrypt("email"), AESEncrypt(data));
    email = data;
  }
  const setIdSchool = function(data) {
    localStorage.setItem(AESEncrypt("id_school"), AESEncrypt(data));
    id_school = data;
  }
  const setIdUser = function(data) {
    localStorage.setItem(AESEncrypt("id_user"), AESEncrypt(data));
    id_user = data;
  }
  const setImage = function(data) {
    localStorage.setItem(AESEncrypt("image"), AESEncrypt(data));
    image = data;
  }
  const setUserType = function(data) {
    localStorage.setItem(AESEncrypt("userType"), AESEncrypt(data));
    userType = data;
  }

  return {
    getName: getName,
    setName: setName,
    getEmail: getEmail,
    setEmail: setEmail,
    getIdSchool: getIdSchool,
    setIdSchool: setIdSchool,
    getIdUser: getIdUser,
    setIdUser: setIdUser,
    getImage: getImage,
    setImage: setImage,
    getUserType: getUserType,
    setUserType: setUserType,
  };

}();

export default UserProfile;
