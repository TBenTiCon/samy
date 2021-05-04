const bcrypt = require('bcrypt');

module.exports.hashPassword = async (pw, req, next) => {
	const salt = await bcrypt.genSalt();
	const pww = await bcrypt.hash(pw, salt);

	return pww;
};
