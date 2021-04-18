const { retrieveTokenInfo } = require('../middleware/authWare');
const User = require('../model/User');

const { handleError } = require('../middleware/errorHandler');

module.exports.getSettingsInfo_post = async (req, res) => {
	retrieveTokenInfo(req, res)
		.then(async (token) => {
			await User.findOne({ userID: token.id }, function (err, user) {
				if (err) {
					throw new Error('findUserErr');
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
		})
		.catch((err) => {
			handleError(err, res);
		});
};

module.exports.changeProfileInfo_post = async (req, res) => {
	retrieveTokenInfo(req, res)
		.then((token) => {
			User.changeInfo(token.id, req.body).then(() => {
				res.status(200).json({ status: 'Info Changed' });
			});
		})
		.catch((err) => {
			handleError(err, res);
		});
};
