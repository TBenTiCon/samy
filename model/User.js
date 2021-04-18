const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const { hashPassword } = require('../middleware/hashingPw');

const bcrypt = require('bcrypt');

const userSchema = new Schema(
	{
		userID: { type: String, default: 'UD_000' },
		email: {
			type: String,
			required: [true, 'please enter a email'],
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

userSchema.statics.changeInfo = async function (userID, changes) {
	const user = await this.findOne({ userID });

	if (user) {
		if (changes.email) user.email = changes.email;
		if (changes.address) user.address = changes.address;
		if (changes.name) user.name = changes.name;
		if (changes.phone) user.phone = changes.phone;

		//only send with Students
		if (changes.schoolType) user.schoolType = changes.schoolType;
		if (changes.class) user.class = changes.class;

		if (changes.password) {
			hashPassword(changes.password)
				.then((pw) => {
					user.password = pw;

					user.save();
					return true;
				})
				.catch((err) => {
					throw Error('Unable to hash password');
				});
		} else {
			user.save();
			return true;
		}
	} else {
		throw Error('Invalid UserID');
	}
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
