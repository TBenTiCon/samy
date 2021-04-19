const jwt = require('jsonwebtoken');
const secret = 'dajlka123jadhkejo842324afnds';
const User = require('../model/User');
const { hashPassword } = require('../middleware/hashingPw');
const { handleError } = require('../middleware/errorHandler');
const { sanitize } = require('../middleware/preventInjection');

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

module.exports.createUser_post = async (req, res, next, userType) => {
	let { email, password } = req.body;

	email = sanitize(email);
	password = sanitize(password);

	try {
		await hashPassword(password, req, next);

		setID()
			.then(async (id) => {
				const user = await User.create({ userID: id, email, password: req.hash, type: userType });

				if (userType === 'student') {
					const jwt = createJWT(user.userID, 'student');
					res.cookie('jwt', jwt, { httpOnly: true, maxAge: maxAge * 1000 });
				}

				res.status(200).json({ status: `${userType}_created` });
			})
			.catch((err) => {
				handleError(err, res);
			});
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.delProfile_post = async (req, res, type) => {
	let id = req.token.id;

	if (type === 'admin') {
		id = req.query.id;
	}

	User.deleteOne({ userID: id }, function (err, result) {
		if (err) {
			handleError(err, res);
		} else {
			if (type === 'student') {
				res.cookie('jwt', '', { maxAge: 0 });
			}

			res.status(200).json({ status: `profile was deleted` });
		}
	});
};

module.exports.login_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.checkLogin(sanitize(email), sanitize(password));

		const jwt = createJWT(user.userID, user.type);

		res.cookie('jwt', jwt, { httpOnly: true, maxAge: maxAge * 1000 });

		res.status(200).json({ status: 'login successfull' });
	} catch (err) {
		handleError(err, res);
	}
};
