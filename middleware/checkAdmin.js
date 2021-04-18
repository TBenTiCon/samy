const jwt = require('jsonwebtoken');
const { handleError } = require('./errorHandler');

module.exports.checkAdmin = (req, res) => {
	let token;

	try {
		try {
			const bearer = req.headers.authorization;
			token = bearer.slice(7, bearer.length);
		} catch (err) {
			throw Error('missing token');
		}

		const verifyToken = async () => {
			const decodedToken = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');

			if (decodedToken) {
				if (decodedToken.type == 'admin') {
					return true;
				} else {
					throw Error('no permission');
				}
			} else {
				throw Error('invalid token');
			}
		};

		return verifyToken();
	} catch (err) {
		handleError(err, res);
	}
};
