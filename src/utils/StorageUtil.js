class StorageUtil {
  static setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  static getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  static removeLocalStorage(key) {
    localStorage.removeItem(key);
  }
}

export default StorageUtil;
