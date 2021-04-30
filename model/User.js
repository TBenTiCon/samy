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
		classTaken: { type: String, default: '0' },
		timeFrame: {
			mo: {
				min: { type: Number, default: '600' },
				max: { type: Number, default: '1185' },
			},
			di: {
				min: { type: Number, default: '600' },
				max: { type: Number, default: '1185' },
			},
			mi: {
				min: { type: Number, default: '600' },
				max: { type: Number, default: '1185' },
			},
			do: {
				min: { type: Number, default: '600' },
				max: { type: Number, default: '1185' },
			},
			fr: {
				min: { type: Number, default: '600' },
				max: { type: Number, default: '1185' },
			},
			sa: {
				min: { type: Number, default: '600' },
				max: { type: Number, default: '1185' },
			},
			so: {
				min: { type: Number, default: '600' },
				max: { type: Number, default: '1185' },
			},
		},
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

userSchema.statics.getInfo = async function (userID) {
	const user = await this.findOne({ userID });

	if (user) {
		const taken = user.classTaken;
		const credits = user.credit;

		return { taken, credits };
	} else {
		throw Error('findUserErr');
	}
};

userSchema.statics.setTimeFrame = async function (userID, changes) {
	const user = await this.findOne({ userID });

	if (user) {
		if (changes) {
			user.timeFrame = changes;
			user.save();

			return true;
		} else {
			throw Error('noChangesErr');
		}
	} else {
		throw Error('findUserErr');
	}
};

userSchema.statics.getTimeFrame = async function (userID) {
	const user = await this.findOne({ userID });

	if (user) {
		return user.timeFrame;
	} else {
		throw Error('findUserErr');
	}
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
