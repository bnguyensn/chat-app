const NodeCache = require('node-cache');

const authCache = new NodeCache({
  checkperiod: 60,
});

module.exports = {
  authCache,
};
