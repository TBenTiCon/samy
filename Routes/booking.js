const express = require('express');
const { handleError } = require('../middleware/errorHandler');
const { retrieveTokenInfo } = require('../middleware/authWare');

const router = express.Router();

const controller = require('../controller/bookingController');

router.post('/appointment/add', retrieveTokenInfo, (req, res) => {
	controller.createAppointment(req, res).catch((err) => {
		handleError(err, res);
	});
});
router.post('/appointment/get', (req, res) => {
	controller.getAppointments(req, res).catch((err) => {
		handleError(err, res);
	});
});

router.post('/appointment/delete', retrieveTokenInfo, controller.deleteAppointment);

module.exports = router;
