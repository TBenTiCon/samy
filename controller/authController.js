const jwt = require('jsonwebtoken');
const secret = 'dajlka123jadhkejo842324afnds';
const User = require('../model/User');
const { retrieveTokenInfo } = require('../middleware/authWare');
const { hashPassword } = require('../middleware/hashingPw');
const { handleError } = require('../middleware/errorHandler');

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

	try {
		hashPassword(password)
			.then((pw) => {
				setID().then(async (id) => {
					const user = await User.create({ userID: id, email, password: pw, type: 'student' });

					const jwt = createJWT(user.userID, 'student');

					res.cookie('jwt', jwt, { httpOnly: true, maxAge: maxAge * 1000 });

					res.status(200).json({ status: 'student_created' });
				});
			})
			.catch((err) => {
				handleError(err, res);
			});
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.createTutor_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		hashPassword(password)
			.then((pw) => {
				setID().then(async (id) => {
					await User.create({ userID: id, email, password: pw, type: 'tutor' });
					res.status(200).json({ status: 'tutor_created' });
				});
			})
			.catch((err) => {
				handleError(err, res);
			});
	} catch (err) {
		handleError(err, res);
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
		handleError(err, res);
	}
};

module.exports.profileDel_post = async (req, res) => {
	try {
		retrieveTokenInfo(req, res)
			.then((token) => {
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
			})
			.catch((err) => {
				handleError(err, res);
			});
	} catch (err) {
		handleError(err, res);
	}
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
		handleError(err, res);
	}
};
