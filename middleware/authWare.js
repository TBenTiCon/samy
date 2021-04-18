const jwt = require('jsonwebtoken');

const authStudent = (req, res, next) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		res.status(401).json({ status: 'invalid or missing Token' });
	}

	jwt.verify(token, 'dajlka123jadhkejo842324afnds', async (err, decodedToken) => {
		if (err) {
			res.status(401).json({ status: 'token unverified' });
		} else {
			if (decodedToken.type === 'student') {
				next();
			} else {
				res.status(401).json({ status: 'not authorized' });
			}
		}
	});
};

const authTutor = (req, res, next) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		res.status(401).json({ status: 'invalid or missing Token' });
	}

	jwt.verify(token, 'dajlka123jadhkejo842324afnds', async (err, decodedToken) => {
		if (err) {
			res.status(401).json({ status: 'token unverified' });
		} else {
			if (decodedToken.type === 'tutor') {
				next();
			} else {
				res.status(401).json({ status: 'not authorized' });
			}
		}
	});
};

const authAdmin = (req, res, next) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		res.status(401).json({ status: 'invalid or missing Token' });
	}

	jwt.verify(token, 'dajlka123jadhkejo842324afnds', async (err, decodedToken) => {
		if (err) {
			res.status(401).json({ status: 'token unverified' });
		} else {
			if (decodedToken.type === 'admin') {
				next();
			} else {
				res.status(401).json({ status: 'not authorized' });
			}
		}
	});
};

const authGeneral = (req, res, next) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		res.status(401).json({ status: 'invalid or missing Token' });
	}

	jwt.verify(token, 'dajlka123jadhkejo842324afnds', async (err, decodedToken) => {
		if (err) {
			res.status(401).json({ status: 'token unverified' });
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
