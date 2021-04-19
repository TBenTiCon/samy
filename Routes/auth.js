const express = require('express');
const { handleError } = require('../middleware/errorHandler');
const { retrieveTokenInfo, checkType } = require('../middleware/authWare');

const router = express.Router();

const controller = require('../controller/authController');

router.post(
	'/user/create',
	(req, res, next) => {
		if (req.query.type) req.type = req.query.type;
		else req.type = 'student';
		next();
	},
	retrieveTokenInfo,
	(req, res, next) => {
		checkType(req, res, next, 'admin');
	},
	(req, res, next) => {
		const type = req.query.type;

		if (type == 'tutor') {
			if (req.typeChecked === true) controller.createUser_post(req, res, next, 'tutor');
			else handleError(Error('no permission'), res);
		} else {
			controller.createUser_post(req, res, next, 'student');
		}
	}
);

router.post(
	'/user/delete',
	retrieveTokenInfo,
	(req, res, next) => {
		checkType(req, res, next, 'admin');
	},
	(req, res) => {
		const action = req.query.action;

		if (action == 'adminDEL') {
			if (req.typeChecked === true) controller.delProfile_post(req, res, 'admin');
			else handleError(Error('no permission'), res);
		} else {
			controller.delProfile_post(req, res, 'student');
		}
	}
);

router.post('/login', controller.login_post);

module.exports = router;
