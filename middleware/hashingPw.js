const bcrypt = require('bcrypt');

module.exports.hashPassword = async (pw) => {
	let password;

	const salt = await bcrypt.genSalt();
	password = await bcrypt.hash(pw, salt);

	return password;
};
