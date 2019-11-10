const express = require('express');
const { asyncWrapper } = require('./utils');
const authMiddlewares = require('../middlewares/auth');
const authControllers = require('../controllers/auth');

const router = express.Router();

router.get('/nonce', asyncWrapper(authControllers.getNonce));
router.post(
  '/token',
  authMiddlewares.injectAuthItems,
  asyncWrapper(authControllers.requestAuthToken)
);

module.exports = router;
