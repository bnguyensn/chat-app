/**
 * Wrap an asynchronous function in another function that catches all potential
 * errors
 */
function asyncWrapper(asyncFn) {
  return (req, res, next) => asyncFn(req, res, next).catch(next);
}

module.exports = {
  asyncWrapper,
};
