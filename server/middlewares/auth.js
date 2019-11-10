const cache = require('../cache').authCache;
const uuidv5 = require('uuid/v5');

function injectAuthItems(req, res, next) {
  const { provider, code, state } = req.body;

  console.log(`provider: ${provider}`);
  console.log(`code: ${code}`);
  console.log(`state: ${state}`);

  req.auth = { provider, code, state };

  next();
}

module.exports = {
  injectAuthItems,
};
