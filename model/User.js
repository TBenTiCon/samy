const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const { hashPassword } = require('../middleware/hashingPw');

const { sanitize } = require('../middleware/preventInjection');

const bcrypt = require('bcrypt');
const { handleError } = require('../middleware/errorHandler');

const userSchema = new Schema(
	{
		userID: { type: String, default: 'UD_000' },
		email: {
			type: String,
			required: [true, 'Please enter a email'],
			unique: true,
			lowercase: true,
			validate: [isEmail, 'Please enter a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Please enter a password'],
			minlength: [6, 'Minimum length is 6 characters'],
		},
		type: { type: String, required: true },
		credit: { type: Number, default: '0' },
		address: { type: Object },
		name: {
			surname: String,
			name: String,
		},
		phone: String,
		schoolType: String,
		class: String,
	},
	{ timestamps: true }
);

userSchema.post('save', function (doc, next) {
	console.log('User was saved to the DB');

	next();
});

userSchema.statics.checkLogin = async function (email, password) {
	const user = await this.findOne({ email });

	if (user) {
		const pwCheck = await bcrypt.compare(password, user.password);

		if (pwCheck) {
			return user;
		}

		console.log('incorrect password');
		throw Error('incorrect password');
	}

	console.log('incorrect email');
	throw Error('incorrect email');
};

userSchema.statics.changeInfo = async function (userID, changes, req, next) {
	const user = await this.findOne({ userID });

	console.log(changes);

	if (user) {
		if (changes.email) user.email = sanitize(changes.email);

		if (changes.address) {
			user.address = sanitize(changes.address);
		}
		if (changes.name) user.name = sanitize(changes.name);

		if (changes.phone) user.phone = sanitize(changes.phone);

		//only send with Students
		if (req.token.type === 'student') {
			if (changes.schoolType) user.schoolType = sanitize(changes.schoolType);
			if (changes.class) user.class = sanitize(changes.class);
		}

		if (changes.password) {
			try {
				await hashPassword(sanitize(changes.password), req, next);

				console.log('hash:' + req.hash);

				user.password = req.hash;
				user.save();

				return true;
			} catch (err) {
				console.log('error');
				throw Error(err.message);
			}
		} else {
			try {
				await user.save();
			} catch (err) {
				throw Error(err.message);
			}

			return true;
		}
	} else {
		throw Error('findUserErr');
	}
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
