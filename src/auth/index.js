import endpoints from './endpoints.json';
import { createQueryString } from './params';
import {
  deleteFromStorage,
  retrieveFromStorage,
  storeInStorage,
} from './storage';
import actions from '../store/actions/auth';

/**
 * Check if an authentication provider is supported.
 *
 * @param {string} provider - E.g. 'github'
 *
 * @returns {boolean} - Return true if the provider is supported
 */
export function providerSupported(provider) {
  return !!endpoints[provider];
}

/**
 * Get a nonce value.
 *
 * @returns {Promise<string>} - A Promise that resolves to the nonce value
 */
export async function getNonce() {
  const res = await fetch('http://localhost:5000/auth/nonce');

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.text();
}

/**
 * Request authentication from a provider. This is step #1 of the OAuth 2.0
 * authentication code flow.
 *
 * @param {string} provider - E.g. 'github'
 * @param {object} opts - Options to help form the authentication request. The
 * most important one is 'state' which is the nonce value used to mitigate CSRF
 * attacks.
 *
 * @returns {Promise<void>}
 */
export async function requestAuthentication(provider, opts) {
  if (!providerSupported(provider)) {
    throw new Error(`Provider '${provider}' is not yet supported.`);
  }

  const providerDetails = endpoints[provider];
  const providerSpecifics = endpoints[provider].providerSpecifics;

  cleanUpAuthStorage();

  storeInStorage('authProvider', provider);

  // ---------- Nonce ---------- //

  const state = await getNonce();

  storeInStorage('authState', state);

  // ---------- Authentication query string ---------- //

  const queryObj = {};

  // Generic parameters that are required for all providers and are the same for
  // all authentication requests
  queryObj.client_id = providerDetails.client_id;
  queryObj.redirect_uri = providerDetails.redirect_uri;

  // Parameters that vary between authentication requests
  queryObj.state = state;
  queryObj.scope = opts.scope;

  // Parameters that are specific to each authentication providers
  if (Array.isArray(providerSpecifics)) {
    providerSpecifics.forEach(specific => {
      queryObj[specific] = opts[specific];
    });
  }

  const queryString = createQueryString(queryObj);

  // ---------- Direct to authentication endpoint ---------- //

  // Store the current page so the user can be re-directed correctly upon
  // successful authentication
  storeInStorage('authPreAuthPage', location.href);

  location.href = `${providerDetails.authEndpoint}?${queryString}`;
}

export async function requestAccessToken({ provider, code, state }, dispatch) {
  // Compare state
  if (retrieveFromStorage('authState') !== state) {
    throw new Error('The provided state value does not match what was stored.');
  }

  // ---------- Request token ---------- //

  console.log(`provider: ${provider}`);
  console.log(`code: ${code}`);
  console.log(`state: ${state}`);

  const tokenRes = await fetch('http://localhost:5000/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider,
      code,
      state,
    }),
  });

  if (!tokenRes.ok) {
    cleanUpAuthStorage();

    throw new Error(await tokenRes.text());
  }

  cleanUpAuthStorage();

  const token = await tokenRes.json();

  dispatch({
    type: actions.UPDATE_TOKENS,
    payload: token,
  });
}

function cleanUpAuthStorage() {
  deleteFromStorage('authState');
  deleteFromStorage('authProvider');
  deleteFromStorage('authPreAuthPage');
}

/**
 * Given a url string and a query parameter name, try to extract the query
 * parameter value.
 *
 * @param {string} url - A DOMString representing a web page URL
 * @param {string} queryParamName - A query parameter name to find in the web
 * page URL
 * @returns {boolean | string} - Return false if no code query parameter was
 * found, or the code value if found
 */
export function extractQueryParam(url, queryParamName) {
  const regex = new RegExp(`(${queryParamName}=)([^&]+)`);
  const matches = url.match(regex);

  return Array.isArray(matches) && matches.length === 3 && matches[2];
}
