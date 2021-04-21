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
