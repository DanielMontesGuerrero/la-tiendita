import {AESDecrypt, AESEncrypt} from './Crypto-Helper';

class UserProfile {
  static getKeyItem(key) {
    const keys = Object.keys(localStorage);
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      if ( AESDecrypt(keys[i]) === key) {
        return keys[i];
      }
    }
    return null;
  }
  static getKey(key) {
    const keyCript = this.getKeyItem(key);
    if ( keyCript !== null) {
      return AESDecrypt(localStorage.getItem(keyCript));
    }
    return null;
  }

  static setKey(key, data) {
    const keyCript = this.getKeyItem(key);
    if ( keyCript !== null) {
      localStorage.removeItem(keyCript);
    }
    localStorage.setItem(AESEncrypt(key), AESEncrypt(data));
  }

  static getIdStore() {
    return this.getKey('id_store');
  }

  static getInstitutionName() {
    return this.getKey('institutionName');
  }

  static getName() {
    return this.getKey('name');
  };

  static getEmail() {
    return this.getKey('email');
  }

  static getIdInstitution() {
    return this.getKey('id_institution');
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

  static setIdStore(id) {
    this.setKey('id_store', id);
  }

  static setInstitutionName(name) {
    this.setKey('institutionName', name);
  }

  static setName(name) {
    this.setKey('name', name);
  };

  static setEmail(email) {
    this.setKey('email', email);
  }

  static setIdInstitution(id) {
    this.setKey('id_institution', id);
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
