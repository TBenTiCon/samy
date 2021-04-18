const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const controller = require('../controller/authController');

router.post('/user/create', (req, res) => {
	const type = req.query.type;

	console.log(type);

	if (type == 'tutor') {
		try {
			checkAdmin(req)
				.then((data) => {
					if (data == true) {
						controller.createTutor_post(req, res);
					} else {
						res.status(401).json({ err: 'no permission' });
					}
				})
				.catch((err) => {
					res.status(401).json({ err: 'failed to create Login | not an Admin' });
				});
		} catch (err) {
			res.status(401).json({ err: 'no permission' });
		}
	} else {
		controller.createStudent_post(req, res);
	}
});

router.post('/user/delete', (req, res) => {
	const action = req.query.action;

	if (action == 'adminDEL') {
		try {
			checkAdmin(req)
				.then((data) => {
					if (data == true) {
						controller.adminDel_post(req, res);
					} else {
						res.status(401).json({ err: 'no permission' });
					}
				})
				.catch((err) => {
					res.status(401).json({ err: 'failed to delete Profile' });
				});
		} catch (err) {
			res.status(401).json({ err: 'no permission' });
		}
	} else {
		controller.profileDel_post(req, res);
	}
});

router.post('/login', controller.login_post);

const checkAdmin = (req) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		res.status(401).json({ status: 'invalid or missing Token' });
	}

	if (token) {
		const verifyToken = async () => {
			const decodedToken = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');

			if (decodedToken) {
				if (decodedToken.type == 'admin') {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		};

		return verifyToken();
	} else {
		return false;
	}
};

module.exports = router;
