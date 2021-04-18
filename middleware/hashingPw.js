const bcrypt = require('bcrypt');
const User = require('../model/User');

module.exports.hashPassword = async (pw) => {
	let password;

	const salt = await bcrypt.genSalt();
	password = await bcrypt.hash(pw, salt);

	return password;
};
