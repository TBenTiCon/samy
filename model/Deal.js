const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealSchema = new Schema(
	{
		titel: {
			type: String,
			required: [true, 'Please enter a title'],
		},
		subTitle: {
			type: String,
			required: [true, 'Please enter a subTitle'],
		},
		code: String,
		imgLink: String,
		cLink: String,
		price: String,
		oldPrice: String,
		afLink: String,
		categorie: String,
		time: Number,
		date: Number,
		likes: Number,
		dislikes: Number,
	},
	{ timestamps: true }
);

const dealModel = mongoose.model('deal', dealSchema);

module.exports = dealModel;
