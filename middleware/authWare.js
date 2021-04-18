const jwt = require('jsonwebtoken');
const { handleError } = require('./errorHandler');
const { sliceToken } = require('../middleware/tokenValidation');

const authPath = async (req, res, next, type) => {
	try {
		retrieveTokenInfo(req, res)
			.then((token) => {
				console.log(token);

				if (token.type == type) {
					next();
				} else if (type == '*') {
					next();
				} else {
					throw Error('no permission');
				}
			})
			.catch((err) => {
				handleError(err, res);
			});
	} catch (err) {
		handleError(err, res);
	}
};

const retrieveTokenInfo = async (req, res) => {
	try {
		const verifyToken = await jwt.verify(await sliceToken(req), 'dajlka123jadhkejo842324afnds');
		return verifyToken;
	} catch (err) {
		throw Error(err.message);
	}
};

module.exports = { retrieveTokenInfo, authPath };
