const Deal = require('../model/Deal');
const Company = require('../model/Company');
const { handleError } = require('../middleware/errorHandler');

module.exports.createDeal = async (req, res) => {
	const {
		titel,
		subTitle,
		code,
		price,
		company,
		oldPrice,
		afLink,
		categorie,
		date,
		time,
		down,
		down_time,
		access_token,
	} = req.body;

	const myCompany = await Company.findOne({ name: company });

	console.log('access_token: ');
	console.log(access_token);

	const imgLink = req.file.path.slice(7);

	const cLink = await myCompany?.imgLink;

	try {
		await Deal.create({
			titel,
			subTitle,
			imgLink,
			cLink,
			code,
			down,
			down_time,
			categorie,
			date,
			price,
			oldPrice,
			afLink,
			time,
		});
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

module.exports.addLike = async (req, res) => {
	const id = req.query.id;

	try {
		const deal = await Deal.findOne({ _id: id });

		deal.likes += 1;
		deal.save();

		res.status(200).json({ status: `like_added` });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.addDislike = async (req, res) => {
	const id = req.query.id;

	try {
		const deal = await Deal.findOne({ _id: id });

		deal.dislikes += 1;
		deal.save();

		res.status(200).json({ status: `dislike_added` });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.getDeal = async (req, res) => {
	const max = req.query.max;

	let admin = false;
	if (req.query.admin) admin = req.query.admin;

	let maxAmount = 10;

	var conditions = {};

	for (var key in req.query) {
		if (req.query.hasOwnProperty(key) && key !== 'max' && key !== 'admin') {
			conditions[key] = req.query[key];
		}
	}

	if (conditions.titel) {
		conditions.titel = { $regex: conditions.titel, $options: 'i' };
	}

	if (conditions.date) {
		conditions.date = {
			$lt: conditions.date,
		};
	}

	if (admin && conditions.date) {
		delete conditions.date;
	}

	console.log('conditions ');
	console.log(conditions);

	if (max) maxAmount = max;

	try {
		/* if (Object.keys(conditions).length === 0) {
			throw Error('No Params given');
		} */

		if (conditions != {}) {
			const deals = await Deal.find(conditions).limit(maxAmount);
			res.status(200).json({ status: deals });
		} else {
			const deals = await Deal.find().limit(maxAmount);
			res.status(200).json({ status: deals });
		}
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

module.exports.getCompany = async (req, res) => {
	const max = req.query.max;

	let maxAmount = 10;

	if (max) maxAmount = max;

	try {
		if (req.query.name === 'undefined') {
			const companys = await Company.find().limit(maxAmount);
			res.status(200).json({ status: companys });
		} else {
			const companys = await Company.find({ name: { $regex: req.query.name, $options: 'i' } }).limit(maxAmount);
			res.status(200).json({ status: companys });
		}
	} catch (err) {
		handleError(err, res);
	}
};
