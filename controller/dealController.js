const Deal = require('../model/Deal');
const Company = require('../model/Company');
const { handleError } = require('../middleware/errorHandler');

module.exports.createDeal = async (req, res) => {
	const { titel, subTitle, code, price, company, oldPrice, afLink, categorie } = req.body;

	const myCompany = await Company.findOne({ name: company });

	console.log(myCompany);

	console.log('filePath: ' + req.file.path);

	console.log('titel: ' + titel);
	console.log('subTitel: ' + subTitle);

	const imgLink = req.file.path.slice(7);
	console.log('imgLink: ' + imgLink);

	const cLink = await myCompany?.imgLink;
	console.log(cLink);

	try {
		await Deal.create({ titel, subTitle, imgLink, cLink });
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
	const cat = req.query.cat;
	const id = req.query.id;
	const key = req.query.key;

	console.log('getting deal key: ' + key);

	try {
		const deals = await Deal.find({
			$or: [{ categorie: cat }, { _id: id }, { titel: { $regex: key, $options: 'i' } }],
		}).limit(10);

		console.log(deals);

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
