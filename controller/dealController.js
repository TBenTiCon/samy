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

const updateDeal = async (req, res, id, data) => {
	try {
		const { titel, subTitle, code, price, company, oldPrice, afLink, categorie, date, time, down, down_time } =
			data;

		const deal = await Deal.findOne({ _id: id });

		const myCompany = await Company.findOne({ name: company });
		const imgLink = req.file?.path?.slice(7);
		const cLink = await myCompany?.imgLink;

		console.log(typeof date);

		if (titel) deal.titel = titel;
		if (subTitle) deal.subTitle = subTitle;
		if (cLink) deal.cLink = cLink;
		if (code) deal.code = code;
		if (price) deal.price = price;
		if (oldPrice) deal.oldPrice = oldPrice;
		if (afLink) deal.afLink = afLink;
		if (categorie) deal.categorie = categorie;
		if (date && typeof date === 'string' && date !== 'NaN') deal.date = date;
		if (date && typeof date === 'string') deal.view_date = await dayToDate(date);
		if (time && typeof time === 'string' && time !== 'NaN') deal.time = time;
		if (down && typeof down === 'string' && down !== 'NaN') deal.down = down;
		if (down_time && typeof down_time === 'string' && down_time !== 'NaN') deal.down_time = down_time;
		if (imgLink && imgLink !== 'NaN') deal.imgLink = imgLink;

		deal.save();

		res.status(200).json({ status: 'deal_updated' });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.createDeal = async (req, res) => {
	let {
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
		Newsletter,
	} = req.body;

	if (req.query.id) {
		updateDeal(req, res, req.query.id, req.body);
	} else {
		try {
			const myCompany = await Company.findOne({ name: company });

			const imgLink = req.file.path.slice(7);

			//check for Facebook
			if (Facebook === 'on' && access_token) {
				await PostToSocialMedia(req);
			}

			if (categorie == 'Kategorie') {
				categorie = 'alle';
			}

			let isNewsLetter = false;

			if (Newsletter === 'on') {
				isNewsLetter = true;
			}

			const cLink = await myCompany?.imgLink;

			if (down == 'NaN') {
				down = 1;
				down_time = 1;
			}

			if (down_time == 'NaN') {
				down = 1;
				down_time = 1;
			}

			if (time == 'NaN') {
				time = 0;
			}

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
				newsletter: isNewsLetter,
				view_date: await dayToDate(date),
			});

			res.status(200).json({ status: `deal_created` });
		} catch (err) {
			console.log(err);
			handleError(err, res);
		}
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

	let maxAmount = 12;

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
			$lte: conditions.date,
		};
	}

	if (admin && conditions.date) {
		delete conditions.date;
	}

	//console.log('conditions ');
	//console.log(conditions);

	if (max && max !== 'undefined') maxAmount = Number(max);

	//console.log('max: ' + maxAmount);

	try {
		/* if (Object.keys(conditions).length === 0) {
			throw Error('No Params given');
		} */

		if (conditions != {}) {
			const deals = await Deal.find(conditions).sort({ date: -1, time: -1 }).limit(maxAmount);

			console.log(deals.length);

			res.status(200).json({ status: deals });
		} else {
			const deals = await Deal.find().sort({ date: -1, time: -1 }).limit(maxAmount);
			res.status(200).json({ status: deals });
		}
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.singleDeal = async (req, res) => {
	const id = req.query.id;

	try {
		const deal = await Deal.findOne({ _id: id });
		res.status(200).json({ status: deal });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.createCompany = async (req, res) => {
	const { name } = req.body;

	try {
		const imgLink = req.file.path.slice(7);
		console.log('imgLink: ' + imgLink);

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

const dayToDate = async (days) => {
	const timeInYears = days / 365;
	const year = Math.floor(timeInYears);
	var day = timeInYears - Math.floor(timeInYears);
	day = day * 365;
	day = Math.round(day);

	const date = new Date(year, 0, 0);
	date.setDate(date.getDate() + day);

	return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};
