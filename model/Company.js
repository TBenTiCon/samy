const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter a name'],
		},

		imgLink: String,
	},
	{ timestamps: true }
);

const companyModel = mongoose.model('company', CompanySchema);

module.exports = companyModel;
