const jwt = require('jsonwebtoken');
const { handleError } = require('./errorHandler');
const { sliceToken } = require('../middleware/tokenValidation');

const authPath = async (req, res, next, type) => {
	try {
		retrieveTokenInfo(req, res)
			.then((token) => {
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

const authStudent = async (req, res, next) => {
	let token;

	try {
		try {
			const bearer = req.headers.authorization;
			token = bearer.slice(7, bearer.length);
		} catch (err) {
			throw Error('missing token');
		}

		try {
			const dkt = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');

			if (!dkt) {
				throw Error('invalid token');
			} else {
				if (dkt.type === 'student') {
					next();
				} else {
					throw Error('no permission');
				}
			}
		} catch (err) {
			handleError(err, res);
		}
	} catch (err) {
		handleError(err, res);
	}
};

const authTutor = async (req, res, next) => {
	let token;

	try {
		try {
			const bearer = req.headers.authorization;
			token = bearer.slice(7, bearer.length);
		} catch (err) {
			throw Error('missing token');
		}

		try {
			const dkt = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');

			if (!dkt) {
				throw Error('invalid token');
			} else {
				if (dkt.type === 'tutor') {
					next();
				} else {
					throw Error('no permission');
				}
			}
		} catch (err) {
			handleError(err, res);
		}
	} catch (err) {
		handleError(err, res);
	}
};

const authAdmin = async (req, res, next) => {
	let token;

	try {
		try {
			const bearer = req.headers.authorization;
			token = bearer.slice(7, bearer.length);
		} catch (err) {
			throw Error('missing token');
		}

		try {
			const dkt = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');

			if (!dkt) {
				throw Error('invalid token');
			} else {
				if (dkt.type === 'admin') {
					next();
				} else {
					throw Error('no permission');
				}
			}
		} catch (err) {
			handleError(err, res);
		}
	} catch (err) {
		handleError(err, res);
	}
};

const authGeneral = async (req, res, next) => {
	let token;

	try {
		try {
			const bearer = req.headers.authorization;
			token = bearer.slice(7, bearer.length);
		} catch (err) {
			throw Error('missing token');
		}
		try {
			const dkt = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');

			if (!dkt) {
				throw Error('invalid token');
			} else {
				next();
			}
		} catch (err) {
			handleError(err, res);
		}
	} catch (err) {
		handleError(err, res);
	}
};

const retrieveTokenInfo = async (req, res) => {
	let token;

	try {
		try {
			const bearer = req.headers.authorization;
			token = bearer.slice(7, bearer.length);
		} catch (err) {
			throw Error('Missing Token');
		}

		try {
			const verifyToken = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');
			return verifyToken;
		} catch (err) {
			throw Error('Invalid Token');
		}
	} catch (err) {
		handleError(err, res);
	}
};

module.exports = { authStudent, authTutor, authAdmin, authGeneral, retrieveTokenInfo, authPath };
