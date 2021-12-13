import {AESDecrypt, AESEncrypt} from './Crypto-Helper';

class UserProfile {
  static getKey(key) {
    const keys = Object.keys(localStorage);
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      if ( AESDecrypt(keys[i]) === key) {
        return AESDecrypt(localStorage.getItem(keys[i]));
      }
    }
    return null;
  }

  static setKey(key, data) {
    localStorage.setItem(AESEncrypt(key), AESEncrypt(data));
  }

  static getName() {
    return this.getKey('name');
  };

  static getEmail() {
    return this.getKey('emai');
  }
  static getIdSchool() {
    return this.getKey('id_school');
  }
  static getIdUser() {
    return this.getKey('id_user');
  }
  static getImage() {
    return this.getKey('image');
  }
  static getUserType() {
    return this.getKey('userType');
  }

  static setName(name) {
    this.setKey('name', name);
  };
  static setEmail(email) {
    this.setKey('email', email);
  }
  static setIdSchool(id) {
    this.setKey('id_school', id);
  }
  static setIdUser(id) {
    this.setKey('id_user', id);
  }
  static setImage(image) {
    this.setKey('image', image);
  }
  static setUserType(userType) {
    this.setKey('userType', userType);
  }
}

export default UserProfile;
