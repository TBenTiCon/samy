const jwt = require('jsonwebtoken');
const { handleError } = require('./errorHandler');

const checkAdmin = async (req, res) => {
	let token;

	try {
		try {
			const bearer = req.headers.authorization;
			token = bearer.slice(7, bearer.length);
		} catch (err) {
			throw Error('missing token');
		}

		await jwt.verify(token, 'dajlka123jadhkejo842324afnds', function (err, decodedToken) {
			if (err) {
				handleError(err, res);
			} else {
				if (decodedToken.type == 'admin') {
					return true;
				} else {
					handleError(Error('no permission'), res);
				}
			}

			return false;
		});
	} catch (err) {
		handleError(err, res);
	}
};

module.exports = { checkAdmin, sliceToken };
