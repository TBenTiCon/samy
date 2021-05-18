const jwt = require('jsonwebtoken');
const secret = 'dajlka123jadhkejo842324afnds';
const User = require('../model/User');
const { hashPassword } = require('../middleware/hashingPw');
const { handleError } = require('../middleware/errorHandler');
const { sanitize } = require('../middleware/preventInjection');

const maxAge = 3 * 24 * 60 * 60;

const createJWT = (id) => {
	return jwt.sign({ id }, secret, { expiresIn: maxAge });
};

const setID = async () => {
	try {
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
	} catch (err) {
		throw Error('cannot create ID');
	}
};

module.exports.createUser_post = async (req, res, next) => {
	let { email, password } = req.body;

	email = sanitize(email);
	password = sanitize(password);

	try {
		await hashPassword(password)
			.then(async (pw) => {
				await setID().then(async (id) => {
					await User.create({
						userID: id,
						email,
						password: pw,
					});

					//console.log("trying to create")
					res.status(200).json({ status: `${email}_created` });
				});
			})
			.catch((err) => {
				console.log('inner handler');
				handleError(err, res);
			});
	} catch (err) {
		console.log('outer handler');
		handleError(err, res);
	}
};

module.exports.delProfile_post = async (req, res) => {
	let id = req.query.id;

	await User.deleteOne({ userID: id }, function (err, result) {
		if (err) {
			handleError(err, res);
		} else {
			res.status(200).json({ status: `profile was deleted` });
		}
	});
};

module.exports.login_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.checkLogin(sanitize(email), sanitize(password));

		const jwt = createJWT(user.userID);

		res.cookie('jwt', jwt, { httpOnly: false, maxAge: maxAge * 1000, secure: false, sameSite: false });

		res.status(200).json({ status: 'successfull' });
	} catch (err) {
		handleError(err, res);
	}
};
