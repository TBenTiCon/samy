const jwt = require('jsonwebtoken');
const { handleError } = require('./errorHandler');

const authPath = (req, res, next, type) => {
	try {
		if (req.token != undefined) {
			if (req.token.type == type) {
				next();
			} else if (type == '*') {
				next();
			} else {
				throw Error('no permission');
			}
		}
	} catch (err) {
		handleError(err, res);
	}
};

const retrieveTokenInfo = async (req, res, next) => {
	try {
		const verifyToken = await jwt.verify(sliceToken(req), 'dajlka123jadhkejo842324afnds');

		req.token = verifyToken;

		return next();
	} catch (err) {
		if (err.message === 'missing token' && req.type === 'student') {
			req.token = undefined;
			return next();
		}

		handleError(err, res);
	}
};

const sliceToken = (req) => {
	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
		return token;
	} catch (err) {
		throw Error('missing token');
	}
};

const checkType = (req, res, next, type) => {
	if (req.token === undefined) {
		req.typeChecked = false;
		return next();
	} else if (req.token.type === type) {
		req.typeChecked = true;
		return next();
	} else {
		req.typeChecked = false;
		return next();
	}
};

module.exports = { retrieveTokenInfo, authPath, checkType };
