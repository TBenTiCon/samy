const bcrypt = require('bcrypt');

module.exports.hashPassword = async (pw, req, next) => {
	const salt = await bcrypt.genSalt();
	req.hash = await bcrypt.hash(pw, salt);

	return next();
};
