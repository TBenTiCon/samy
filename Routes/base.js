const express = require('express');
const router = express.Router();
const controller = require('../controller/baseController');

router.get('/', controller.renderLanding);
router.get('/crop', controller.renderCropping);

module.exports = router;
