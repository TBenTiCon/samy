module.exports.checkAdmin = (req) => {
	let token;

	try {
		const bearer = req.headers.authorization;
		token = bearer.slice(7, bearer.length);
	} catch (err) {
		throw Error('Missing Token');
	}

	const verifyToken = async () => {
		const decodedToken = await jwt.verify(token, 'dajlka123jadhkejo842324afnds');

		if (decodedToken) {
			if (decodedToken.type == 'admin') {
				return true;
			} else {
				throw Error('No Permission');
			}
		} else {
			throw Error('Invalid Token');
		}
	};

	return verifyToken();
};
