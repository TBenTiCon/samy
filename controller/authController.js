const jwt = require('jsonwebtoken');
const secret = 'dajlka123jadhkejo842324afnds';
const User = require('../model/User');
const { retrieveTokenInfo } = require('../middleware/authWare');
const { hashPassword } = require('../middleware/hashingPw');

const maxAge = 3 * 24 * 60 * 60;

const createJWT = (id, type) => {
	return jwt.sign({ id, type }, secret, { expiresIn: maxAge });
};

const setID = async () => {
	let maxID = await User.findOne({}, {}, { sort: { createdAt: -1 } }, function (err, id) {
		if (err) {
			return 0;
		} else {
			return id;
		}
	});

	if (typeof maxID == 'object' && maxID !== null) {
		maxID = maxID.userID.slice(3, maxID.length);
		maxID = Number(maxID) + 1;
	} else {
		maxID = 0;
	}

	return `UD_${maxID}`;
};

module.exports.createStudent_post = async (req, res) => {
	const { email, password } = req.body;

	hashPassword(password)
		.then((pw) => {
			setID()
				.then(async (id) => {
					const user = await User.create({ userID: id, email, password: pw, type: 'student' });

					const jwt = createJWT(user.userID, 'student');

					res.cookie('jwt', jwt, { httpOnly: true, maxAge: maxAge * 1000 });

					res.status(200).json({ status: 'student_created' });
				})
				.catch((err) => {
					console.log(err);
					console.log('failed at creating ID');
					res.json({ status: 'failed to create Account' });
				});
		})
		.catch((err) => {
			console.log('failed at hashing password');
			res.json({ status: 'failed to create Account' });
		});
};

module.exports.createTutor_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		hashPassword(password)
			.then((pw) => {
				setID()
					.then(async (id) => {
						await User.create({ userID: id, email, password: pw, type: 'tutor' });
						res.status(200).json({ status: 'tutor_created' });
					})
					.catch((err) => {
						console.log('failed at creating ID');
						console.log(err);
						res.json({ status: 'failed to create Account' });
					});
			})
			.catch((err) => {
				console.log('failed at hashing password');
				res.json({ status: 'failed to create Account' });
			});
	} catch (err) {
		res.json({ status: 'failed to create account' });
	}
};

module.exports.adminDel_post = async (req, res) => {
	const id = req.query.id;

	try {
		User.deleteOne({ userID: id }, function (err, result) {
			if (err) {
				console.log(err);
				res.json({ status: 'could not find user in DB' });
			} else {
				console.log('Deleted as Admin');
				res.status(200).json({ status: `${id} was deleted` });
			}
		});
	} catch (err) {
		console.log(err);
		res.json({ status: 'could not find user in DB' });
	}
};

module.exports.profileDel_post = async (req, res) => {
	retrieveTokenInfo(req, res)
		.then((token) => {
			try {
				User.deleteOne({ userID: token.id }, function (err, result) {
					if (err) {
						console.log(err);
						res.json({ status: 'could not find user in DB' });
					} else {
						console.log('deleted');
					}
				});

				res.cookie('jwt', '', { maxAge: 0 });
				res.status(200).json({ status: `${token.id} was deleted` });
			} catch (err) {
				res.json({ status: 'could not find user in DB' });
			}
		})
		.catch((err) => {
			console.log('failed to retrieve Token at authController.js - profileDel_post');
			res.json({ status: 'failed to validate Token' });
		});
};

module.exports.login_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.checkLogin(email, password);

		const jwt = createJWT(user.userID, user.type);

		console.log('jwtType: ' + user.type);

		res.cookie('jwt', jwt, { httpOnly: true, maxAge: maxAge * 1000 });

		res.status(200).json({ status: 'login successfull' });
	} catch (err) {
		if (err.message === 'incorrect password') {
			res.status(400).json({ error: 'incorrect password' });
		} else if (err.message === 'incorrect email') {
			res.status(400).json({ error: 'incorrect email' });
		} else {
			res.status(400).json({ error: 'Login failed' });
		}
	}
};
