const jwt = require('jsonwebtoken');

const checkAdmin = async (req) => {
	const decodedToken = await jwt.verify(await sliceToken(req), 'dajlka123jadhkejo842324afnds');

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

const sliceToken = async (req) => {
	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
		return token;
	} catch (err) {
		throw Error('missing token');
	}
};

module.exports = { checkAdmin, sliceToken };
