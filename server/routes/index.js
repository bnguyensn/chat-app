const express = require('express');
const ping = require('./ping');
const auth = require('./auth');

const router = express.Router();

router.use('/ping', ping);
router.use('/auth', auth);

module.exports = router;
