const Deal = require('../model/Deal');
const fetch = require('node-fetch');
const newsletter = require('../model/Newsletter');
const { handleError } = require('../middleware/errorHandler');

module.exports.sendNewsLetter = async (req, res) => {
	try {
		const deals = await Deal.find({ newsletter: true }).limit(16);

		deals.forEach(async (deal) => {
			//deal.imgLink = `http://localhost:3720/${deal.imgLink}`;
			deal.imgLink = `https://samy.reversedstudios.com/${deal.imgLink}`;
		});

		const targets = await newsletter.find();

		const body = {
			email: 'test@benticon.de',
			deals,
			targets,
		};

		await fetch(`https://mail.samy.reversedstudios.com/send`, {
			method: 'post',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});

		res.json({ status: 'success' });

		deals.forEach(async (deal) => {
			deal.newsletter = false;
			await deal.save();
		});
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.sendTest = async (req, res) => {
	try {
		const deals = await Deal.find({ newsletter: true }).limit(16);

		deals.forEach(async (deal) => {
			deal.imgLink = `https://samy.reversedstudios.com/${deal.imgLink}`;
		});

		const targets = await newsletter.find({ email: 'plausch@attain-it.de' });

		const body = {
			email: 'test@benticon.de',
			deals,
			targets,
		};

		await fetch(`https://mail.samy.reversedstudios.com/send`, {
			method: 'post',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});

		res.json({ status: 'success' });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.addEmail = async (req, res) => {
	try {
		if (req.query.email) {
			await newsletter.create({ email: req.query.email });
			res.status(200).json({ status: 'OK' });
		} else {
			res.status(400).json({ status: 'NoEmailSpecified' });
		}
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.deleteEmail = async (req, res) => {
	try {
		await newsletter.deleteOne({ email: req.query.email });

		res.status(200).json({ status: `email_deleted` });
	} catch (err) {
		handleError(err, res);
	}
};

module.exports.getNAmount = async (req, res) => {
	try {
		Deal.find({ newsletter: true }).count(function (err, count) {
			res.json(`${count}`);
		});
	} catch (err) {
		handleError(err, res);
	}
};
