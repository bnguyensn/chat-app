import endpoints from './endpoints.json';
import getOAuthQueryParamsString from './params';

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

export async function requestAuthCode(provider) {
  if (!endpoints[provider]) {
    throw new Error(`OAuth provider '${provider}' is not supported.`);
  }

  const authEndpoint = endpoints[provider].authEndpoint;

  const authQueryParamsString = await getOAuthQueryParamsString({
    login: undefined,
  });

  const url = `${authEndpoint}?${authQueryParamsString}`;

  const headers = new Headers();
  headers.append('Access-Control-Allow-Origin', '*');

  await fetch(url, {
    method: 'GET',
    headers,
  });
}

export async function requestAccessToken(provider, code, state) {
  if (!endpoints[provider]) {
    throw new Error(`OAuth provider '${provider}' is not supported.`);
  }

  const url = endpoints[provider].accessTokenEndpoint;

  const headers = new Headers();
  headers.append('Accept', 'application/json');

  const body = JSON.stringify({
    client_id: endpoints[provider].client_id,
    client_secret: endpoints[provider].client_secret,
    redirect_uri: endpoints[provider].redirect_uri,
    code,
    state,
  });

  const res = await fetch(url, {
    method: 'POST',
    body,
  });

  return await res.json();
}
