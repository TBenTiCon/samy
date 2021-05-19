const express = require('express');
const { handleError } = require('../middleware/errorHandler');
const { retrieveTokenInfo } = require('../middleware/authWare');

const controller = require('../controller/newsController');

const router = express.Router();

router.get('/newsletter', (req, res) => {
	res.render('newsletter');
});

router.get('/unsubscribe', (req, res) => {
	res.render('unsubscribe');
});

router.post('/subscribe', controller.addEmail);
router.delete('/subscribe', controller.deleteEmail);

router.post('/sendMails', retrieveTokenInfo, controller.sendNewsLetter);

module.exports = router;
