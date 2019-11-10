/**
 * Wrap an asynchronous function in another function that catches all potential
 * errors
 */
function asyncWrapper(asyncFn) {
  return (req, res, next) => {
    Promise.resolve(asyncFn(req, res, next))
      .then(err => {
        throw err;
      })
      .catch(next);
  };
}

module.exports = {
  asyncWrapper,
};
