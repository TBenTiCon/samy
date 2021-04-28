const Appointment = require('../model/Appointment');
const { handleError } = require('../middleware/errorHandler');

module.exports.getMyAppointments = async (req, res) => {
	const id = req.token.id;

	const body = req.body;

	let max = 10;
	let past = false;
	let post = false;
	let date = false;
	let SearchObj = { student_ID: id };

	if (body.max) max = body.max;
	if (body.past) past = body.past;
	if (body.post) post = body.post;
	if (body.date) date = body.date;

	if (past || post) {
		if (post) {
			SearchObj = {
				student_ID: id,
				'time.date': {
					$gte: date,
				},
			};
		} else {
			SearchObj = {
				student_ID: id,
				'time.date': {
					$lt: date,
				},
			};
		}
	}

	try {
		const searchResult = await Appointment.find(SearchObj).limit(max).sort({
			'time.time': 1,
		});

		if (searchResult === undefined || searchResult === '{}' || searchResult === {} || searchResult === []) {
			throw Error('no Appointments available');
		}

		console.log(searchResult);

		res.status(200).json({ result: searchResult });
	} catch (err) {
		handleError(err, res);
	}
};
