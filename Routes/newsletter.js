const express = require('express');
const { handleError } = require('../middleware/errorHandler');
const { retrieveTokenInfo } = require('../middleware/authWare');

const controller = require('../controller/newsController');

const router = express.Router();

router.get('/sendMails', controller.sendNewsLetter);

router.get('/newsletter', (req, res) => {
	res.render('newsletter');
});
router.post('/subscribe', controller.addEmail);
router.delete('/subscribe', controller.deleteEmail);

module.exports = router;
