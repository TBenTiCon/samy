const User = require('../model/User');

const { handleError } = require('../middleware/errorHandler');

module.exports.getSettingsInfo_post = async (req, res) => {
	await User.findOne({ userID: req.token.id }, function (err, user) {
		if (err) {
			handleError(Error('findUserErr'), res);
		} else {
			res.json({
				email: user.email,
				address: user.address,
				phone: user.phone,
				name: user.name,
				credit: user.credit,
			});
		}
	});
};

module.exports.changeProfileInfo_post = async (req, res) => {
	User.changeInfo(req.token.id, req.body, req)
		.then(() => {
			res.status(200).json({ status: 'Info Changed' });
		})
		.catch((err) => {
			handleError(err, res);
		});
};
