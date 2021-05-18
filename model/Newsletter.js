const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsletterSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Please enter an email'],
			unique: true,
		},
	},
	{ timestamps: true }
);

const newsletterModel = mongoose.model('newsletter', NewsletterSchema);

module.exports = newsletterModel;
