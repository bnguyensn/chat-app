const crypto = require('crypto');
const fetch = require('node-fetch');
const cache = require('../cache').authCache;
const uuidv5 = require('uuid/v5');

const availableProviders = ['github'];

function createNonce() {
  const secret = process.env.AUTH_NONCE_SECRET;
  const update = process.env.AUTH_NONCE_UPDATE;

  // Generate a nonce
  const nonce = crypto
    .createHmac('sha256', secret)
    .update(update)
    .digest('hex');

  // Store the nonce in our cache
  const nonceId = uuidv5(nonce, process.env.AUTH_NONCE_NAMESPACE);
  if (!cache.set(nonceId, nonce)) {
    throw new Error(`createNonce(): could not save nonce to cache`);
  }

  // Return the nonce for consumption by the authentication flow
  return nonce;
}

function createQueryString(provider, providerOpts) {
  const queryObj = {};

  const varBase = `AUTH_${provider.toUpperCase()}`;

  // Generic parameters that are required for all providers
  queryObj.client_id = process.env[`${varBase}_CLIENT_ID`];
  queryObj.redirect_uri = process.env[`${varBase}_REDIRECT_URI`];
  queryObj.scope = process.env[`${varBase}_SCOPE`];
  queryObj.state = createNonce();

  // Provider-specific parameters
  if (provider === 'github') {
    queryObj.login = providerOpts.login;
    queryObj.allow_signup = process.env[`${varBase}_ALLOW_SIGNUP`];
  }

  return Object.keys(queryObj).reduce((finalQueryString, queryKey, index) => {
    if (typeof queryObj[queryKey] !== 'boolean' && !queryObj[queryKey]) {
      return finalQueryString;
    }

    const queryValue = encodeURIComponent(queryObj[queryKey]);
    const ampersand = index === 0 ? '' : '&';

    return `${finalQueryString}${ampersand}${queryKey}=${queryValue}`;
  }, '');
}

/**
 * Request authentication code. This is step #1 of the implicit OAuth 2.0
 * authentication flow.
 */
module.exports.requestAuthCode = async function(req, res) {
  const { provider, providerOpts = {} } = req.query;

  if (!availableProviders.includes(provider)) {
    return res.status(400).send(`Provider '${provider}' is not supported yet.`);
  }

  const endpoint = process.env[`AUTH_${provider.toUpperCase()}_AUTHENDPOINT`];
  const queryString = createQueryString(provider, providerOpts);

  await fetch(`${endpoint}?${queryString}`);
};

/**
 * Request authentication token. This is step #2 of the implicit OAuth 2.0
 * authentication flow.
 *
 * Note that we have a middleware that adds the 'auth' property to the 'req'
 * object before this controller is invoked.
 */
module.exports.requestAuthToken = async function(req, res) {
  const { provider, code, state } = req.auth;

  const varBase = `AUTH_${provider.toUpperCase()}`;

  const endpoint = process.env[`${varBase}_ACCESSTOKENENDPOINT`];

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const body = {
    client_id: process.env[`${varBase}_CLIENT_ID`],
    client_secret: process.env[`${varBase}_CLIENT_SECRET`],
    redirect_uri: process.env[`${varBase}_REDIRECT_URI`],
    code,
    state,
  };

  const authTokenRes = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!authTokenRes.ok) {
    throw new Error("requestAuthToken(): network request's result is NOT ok");
  }

  const authTokenBody = await authTokenRes.json();

  console.log(authTokenBody);

  res.status(200).json(authTokenBody);
};
