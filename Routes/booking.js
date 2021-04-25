const express = require('express');
const { handleError } = require('../middleware/errorHandler');
const { retrieveTokenInfo } = require('../middleware/authWare');

const router = express.Router();

const controller = require('../controller/bookingController');

router.post('/appointment/add', retrieveTokenInfo, (req, res) => {
	controller.createAppointment(req, res).catch((err) => {
		handleError(err);
	});
});
router.post('/appointment/get', (req, res) => {
	controller.getAppointments(req, res).catch((err) => {
		handleError(err);
	});
});

module.exports = router;
