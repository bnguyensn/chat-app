// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Testing_for_availability
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0)
    );
  }
}

export function storeInStorage(key, value) {
  if (!storageAvailable('localStorage')) {
    throw new Error('LocalStorage is not supported by this browser.');
  }

  localStorage.setItem(key, value);
}

export function retrieveFromStorage(key) {
  if (!storageAvailable('localStorage')) {
    throw new Error('LocalStorage is not supported by this browser.');
  }

  return localStorage.getItem(key);
}

export function deleteFromStorage(key) {
  if (!storageAvailable('localStorage')) {
    throw new Error('LocalStorage is not supported by this browser.');
  }

  localStorage.removeItem(key);
}

export function clearStorage() {
  localStorage.clear();
}
