import { storeInLocalStorage } from './storage';

async function createState() {
  const algorithm = {
    name: 'RSA-OAEP',
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  };

  return crypto.subtle.generateKey(algorithm, false, ['sign']);
}

function convertObjToQueryParamsString(obj) {
  return Object.keys(obj).reduce((queryParamsString, key, index, keys) => {
    const connector = index === keys.length - 1 ? '' : '&';
    return `${queryParamsString}=${encodeURIComponent(obj[key])}${connector}`;
  }, '');
}

export default async function getOAuthQueryParamsString({ login }) {
  // This can also be referred to as the 'nonce'.
  const state = await createState();

  // Store the state in LocalStorage
  storeInLocalStorage('state', state);

  // https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#parameters
  const oauthParams = {
    client_id: 'f1dab68eb987086a083e',
    redirect_uri: 'http://localhost:8000',
    login,
    state,
    allow_signup: true,
  };

  return convertObjToQueryParamsString(oauthParams);
}
