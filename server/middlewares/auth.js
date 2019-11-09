const cache = require('../cache').authCache;
const uuidv5 = require('uuid/v5');

function injectAuthItems(req, res, next) {
  const provider = req.hostname.split('.')[0];
  const { code, state } = req.query;

  // Compare the request's state value vs. the stored state value
  const stateId = uuidv5(state, process.env.AUTH_NONCE_NAMESPACE);
  const storedState = cache.get(stateId);
  if (storedState === undefined || storedState !== state) {
    throw new Error('injectAuthItems(): state mismatch! Aborting process');
  }

  // Remove the stored state value as it's no longer needed by any other
  // processes
  cache.del(stateId);

  // Inject necessary items to the 'req' object
  req.auth = { provider, code, state };

  next();
}

module.exports = {
  injectAuthItems,
};
