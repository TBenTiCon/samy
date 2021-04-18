const jwt = require('jsonwebtoken');

const authStudent = async (req, res, next) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		throw Error('missing token');
	}

	await jwt.verify(token, 'dajlka123jadhkejo842324afnds', async (err, decodedToken) => {
		if (err) {
			throw Error('invalid token');
		} else {
			if (decodedToken.type === 'student') {
				next();
			} else {
				throw Error('no permission');
			}
		}
	});
};

const authTutor = async (req, res, next) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		throw Error('missing token');
	}

	await jwt.verify(token, 'dajlka123jadhkejo842324afnds', async (err, decodedToken) => {
		if (err) {
			throw Error('invalid token');
		} else {
			if (decodedToken.type === 'tutor') {
				next();
			} else {
				throw Error('no permission');
			}
		}
	});
};

const authAdmin = async (req, res, next) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		throw Error('missing token');
	}

	await jwt.verify(token, 'dajlka123jadhkejo842324afnds', async (err, decodedToken) => {
		if (err) {
			throw Error('invalid token');
		} else {
			if (decodedToken.type === 'admin') {
				next();
			} else {
				throw Error('no permission');
			}
		}
	});
};

const authGeneral = async (req, res, next) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		throw Error('missing token');
	}

	await jwt.verify(token, 'dajlka123jadhkejo842324afnds', async (err, decodedToken) => {
		if (err) {
			throw Error('invalid token');
		} else {
			next();
		}
	});
};

const retrieveTokenInfo = async (req, res) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		console.log(err);
		throw Error('Missing Token');
	}

	try {
		const verifyToken = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');
		return verifyToken;
	} catch (err) {
		console.log(err);
		throw Error('Invalid Token');
	}
};

module.exports = { authStudent, authTutor, authAdmin, authGeneral, retrieveTokenInfo };
