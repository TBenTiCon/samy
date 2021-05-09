const express = require('express');
const router = express.Router();
const controller = require('../controller/baseController');

router.get('/', controller.renderLanding);

module.exports = router;
