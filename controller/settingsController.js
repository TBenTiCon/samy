const { retrieveTokenInfo } = require('../middleware/authWare');
const User = require('../model/User');

module.exports.getSettingsInfo_post = async (req, res) => {
	retrieveTokenInfo(req, res)
		.then(async (token) => {
			await User.findOne({ userID: token.id }, function (err, user) {
				if (err) {
					console.log('failed to access user from DB at settingsController.js - getSettingsInfo_post');
					res.json({ status: 'unable to access token' });
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
			console.log('failed to retrieve Token at settingsController.js - getSettingsInfo_post');
			res.json({ status: 'failed to validate Token' });
		});
};

module.exports.changeProfileInfo_post = async (req, res) => {
	retrieveTokenInfo(req, res)
		.then((token) => {
			User.changeInfo(token.id, req.body)
				.then(() => {
					res.status(200).json({ status: 'Info Changed' });
				})
				.catch((err) => {
					console.log(err);
					res.json({ status: 'failed to change Info' });
				});
		})
		.catch((err) => {
			console.log(err);
			console.log('failed to retrieve Token at settingsController.js - changeProfileInfo_post');
			res.json({ status: 'failed to validate Token' });
		});
};
