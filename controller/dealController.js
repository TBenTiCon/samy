const Deal = require('../model/Deal');
const Company = require('../model/Company');
const { handleError } = require('../middleware/errorHandler');
const fetch = require('node-fetch');

const PostToSocialMedia = async (req) => {
	const { titel, subTitle, code, price, oldPrice, afLink, access_token } = req.body;

	const imgLink = req.file.path.slice(7);
	/* 
		FaceBook Posting 
	*/

	//get Page Access
	const fbPageAccess = await fetch(
		`https://graph.facebook.com/105151565090283?fields=access_token&access_token=${access_token}`
	);

	const fbPageAccessJSON = await fbPageAccess.json();
	const page_access_token = fbPageAccessJSON.access_token;

	console.log(imgLink);

	//Create FB_PhotoPost
	await fetch(
		`https://graph.facebook.com/105151565090283/photos?url=https://upload.wikimedia.org/wikipedia/commons/0/0e/Tree_example_VIS.jpg&access_token=${page_access_token}&caption=${`* Deal des Tages * \r\n\r\n ${titel} \r\n ${subTitle} \r\n\r\n **${price}EUR** statt ${oldPrice}EUR \r\n\r\n ${Math.round(
			100 - parseFloat(price) / (parseFloat(oldPrice) / 100)
		)}% Rabatt \r\n\r\n ${code ? 'Code: ' + code : ''} \r\n\r\n ${afLink}`}`,
		{ method: 'POST' }
	);

	/* 
		Instagram Posting 
	*/

	//get IG access
	const IGKeyReq = await fetch(
		`https://graph.facebook.com/v10.0/105151565090283?fields=instagram_business_account&access_token=${access_token}`,
		{
			method: 'GET',
		}
	);

	const IGKey = await IGKeyReq.json();

	//Upload IMG
	const uploadIG = await fetch(
		`https://graph.facebook.com/${
			IGKey.instagram_business_account?.id
		}/media?image_url=https://upload.wikimedia.org/wikipedia/commons/0/0e/Tree_example_VIS.jpg&access_token=${access_token}&caption=${`\r\n\r\n * Deal des Tages * \r\n\r\n ${titel} \r\n ${subTitle} \r\n\r\n **${price}EUR** statt ${oldPrice}EUR \r\n\r\n ${Math.round(
			100 - parseFloat(price) / (parseFloat(oldPrice) / 100)
		)}% Rabatt \r\n\r\n ${code ? 'Code: ' + code : ''} \r\n\r\n ${afLink}`}`,
		{ method: 'POST' }
	);

	const IGPOSTContainer = await uploadIG.json();
	const PostID = await IGPOSTContainer.id;

	//POST IMG
	await fetch(
		`https://graph.facebook.com/${IGKey.instagram_business_account?.id}/media_publish?creation_id=${PostID}&access_token=${access_token}`,
		{ method: 'POST' }
	);
};

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
		Facebook,
	} = req.body;

	const myCompany = await Company.findOne({ name: company });

	const imgLink = req.file.path.slice(7);

	//check for Facebook
	if (Facebook === 'on') {
		await PostToSocialMedia(req);
	}

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
