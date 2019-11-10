const crypto = require('crypto');
const fetch = require('node-fetch');

const availableProviders = ['github'];

function createNonce() {
  const secret = process.env.AUTH_NONCE_SECRET;
  const update = process.env.AUTH_NONCE_UPDATE;

  return crypto
    .createHmac('sha256', secret)
    .update(update)
    .digest('hex');
}

/**
 * Respond with a nonce value, commonly used as a 'state' value in the
 * authentication flow.
 */
module.exports.getNonce = function(req, res) {
  const nonce = createNonce();

  res.status(200).send(nonce);
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
