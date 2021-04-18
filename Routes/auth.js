const express = require('express');
const { checkAdmin } = require('../middleware/tokenValidation');
const { handleError } = require('../middleware/errorHandler');

const router = express.Router();

const controller = require('../controller/authController');

router.post('/user/create', (req, res) => {
	const type = req.query.type;

	if (type == 'tutor') {
		checkAdmin(req, res)
			.then(() => {
				controller.createUser_post(req, res, 'tutor');
			})
			.catch((err) => {
				console.log('catched');
				handleError(err, res);
			});
	} else {
		controller.createUser_post(req, res, 'student');
	}
});

router.post('/user/delete', (req, res) => {
	const action = req.query.action;

	if (action == 'adminDEL') {
		checkAdmin(req, res)
			.then(() => {
				controller.adminDel_post(req, res);
			})
			.catch((err) => {
				handleError(err, res);
			});
	} else {
		controller.profileDel_post(req, res);
	}
});

router.post('/login', controller.login_post);

module.exports = router;
