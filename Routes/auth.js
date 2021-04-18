const express = require('express');
const { checkAdmin } = require('../middleware/checkAdmin');
const { handleError } = require('../middleware/errorHandler');

const router = express.Router();

const controller = require('../controller/authController');

router.post('/user/create', (req, res) => {
	const type = req.query.type;

	console.log(type);

	if (type == 'tutor') {
		checkAdmin(req)
			.then((data) => {
				if (data == true) {
					controller.createTutor_post(req, res);
				} else {
					throw Error('no permission');
				}
			})
			.catch((err) => {
				handleError(err, res);
			});
	} else {
		controller.createStudent_post(req, res);
	}
});

router.post('/user/delete', (req, res) => {
	const action = req.query.action;

	if (action == 'adminDEL') {
		checkAdmin(req)
			.then((data) => {
				if (data == true) {
					controller.adminDel_post(req, res);
				} else {
					throw Error('no permission');
				}
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
