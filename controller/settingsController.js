const User = require('../model/User');

const { handleError } = require('../middleware/errorHandler');

const { sanitize } = require('../middleware/preventInjection');

module.exports.getSettingsInfo_post = async (req, res) => {
	await User.findOne({ userID: req.token.id }, function (err, user) {
		if (err) {
			handleError(Error('findUserErr'), res);
		} else {
			res.json({
				email: sanitize(user.email),
				address: sanitize(user.address),
				phone: sanitize(user.phone),
				name: sanitize(user.name),
				credit: sanitize(user.credit),
				schoolType: sanitize(user.schoolType),
				class: sanitize(user.class),
			});
		}
	});
};

module.exports.changeProfileInfo_post = async (req, res, next) => {
	try {
		await User.changeInfo(req.token.id, req.body, req, next)
			.then(() => {
				res.status(200).json({ status: 'Info Changed' });
			})
			.catch((err) => {
				handleError(err, res);
			});
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.getMetaInfo = async (req, res) => {
	try {
		const id = req.token.id;
		User.getInfo(id)
			.then((data) => {
				console.log('data: ');

				res.status(200).json(data);
			})
			.catch((err) => {
				throw Error(err.message);
			});
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.setTimeFrame = async (req, res) => {
	try {
		await User.setTimeFrame(req.token.id, req.body)
			.then(() => {
				res.status(200).json({ status: 'Info Changed' });
			})
			.catch((err) => {
				handleError(err, res);
			});
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.getTimeFrame = async (req, res) => {
	try {
		await User.getTimeFrame(req.token.id)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				handleError(err, res);
			});
	} catch (err) {
		handleError(err, res);
	}
};
