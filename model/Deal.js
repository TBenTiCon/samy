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
		view_date: String,
		down: Number,
		down_time: Number,
		likes: { type: Number, default: '0' },
		dislikes: { type: Number, default: '0' },
		newsletter: { type: Boolean, default: 'false' },
	},
	{ timestamps: true }
);

const dealModel = mongoose.model('deal', dealSchema);

module.exports = dealModel;
