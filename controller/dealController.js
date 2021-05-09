const Deal = require('../model/Deal');
const Company = require('../model/Company');
const { handleError } = require('../middleware/errorHandler');

module.exports.createDeal = async (req, res) => {
	const { titel, subTitle, code, price, company, oldPrice, afLink, categorie, date, time } = req.body;

	const myCompany = await Company.findOne({ name: company });

	const imgLink = req.file.path.slice(7);

	const cLink = await myCompany?.imgLink;

	try {
		await Deal.create({ titel, subTitle, imgLink, cLink, date, price, oldPrice, afLink, time });
		res.status(200).json({ status: `deal_created` });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.delDeal = async (req, res) => {
	const id = req.query.id;

	console.log('deleting deal');

	try {
		await Deal.deleteOne({ _id: id });

		res.status(200).json({ status: `deal_deleted` });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.getDeal = async (req, res) => {
	const max = req.query.max;

	let maxAmount = 10;

	var conditions = {};

	for (var key in req.query) {
		if (req.query.hasOwnProperty(key) && key !== 'max') {
			conditions[key] = req.query[key];
		}
	}

	if (conditions.titel) {
		conditions.titel = { $regex: conditions.titel, $options: 'i' };
	}

	console.log('conditions ');
	console.log(conditions);

	if (conditions.date) {
		conditions.date = {
			$lt: conditions.date,
		};
	}

	console.log('conditions ');
	console.log(conditions);

	if (max) maxAmount = max;

	try {
		if (Object.keys(conditions).length === 0) {
			throw Error('No Params given');
		}

		const deals = await Deal.find(conditions).limit(maxAmount);

		res.status(200).json({ status: deals });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.createCompany = async (req, res) => {
	const { name } = req.body;

	console.log('filePath: ' + req.file.path);

	console.log('name: ' + name);

	const imgLink = req.file.path.slice(7);
	console.log('imgLink: ' + imgLink);

	try {
		await Company.create({ name, imgLink });
		res.status(200).json({ status: `company_created` });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.delCompany = async (req, res) => {
	const id = req.query.id;

	console.log('deleting Company');

	try {
		await Company.deleteOne({ _id: id });

		res.status(200).json({ status: `company_deleted` });
	} catch (err) {
		handleError(err, res);
	}
};
