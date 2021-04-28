const Appointment = require('../model/Appointment');
const { handleError } = require('../middleware/errorHandler');

module.exports.createAppointment = async (req, res) => {
	const body = req.body;

	//const date = parseISO(body.date);
	const date = body.date;

	const time = Appointment.createTime(date, body.time, body.duration);

	const tutor_id = req.body.tutor_id;
	console.log('tutorID: ' + tutor_id);

	const appointment_ID = req.body.tutor_id + req.token.id + time.date + time.time;

	//get appointments
	const slots = await Appointment.find({ tutor_ID: req.body.tutor_id, 'time.date': time.date }).sort({
		'time.time': 1,
	});
	console.log('checkSlots: ' + slots);

	//serverside check for alreadyBookedSlots
	await slots.forEach((slot) => {
		if (slot.time.time === time.time) {
			throw Error('alreadyBookedExeption');
		} else if (slot.time.time > time.time && slot.time.time - time.duration < time.time) {
			throw Error('alreadyBookedExeption');
		}
	});

	await Appointment.create({ appointment_ID, tutor_ID: tutor_id, student_ID: req.token.id, time });

	res.status(200).json({ status: `appointment_created` });
};

module.exports.getAppointments = async (req, res) => {
	const query = req.body.date;
	console.log('searchingDate: ' + query);

	//737780

	const slots = await Appointment.find({ tutor_ID: req.body.tutor_id, 'time.date': query }).sort({ 'time.time': 1 });

	console.log(slots);

	res.status(200).json({ slots });
};

module.exports.deleteAppointment = async (req, res) => {
	try {
		const id = req.body.id;
		const userID = req.token.id;

		if (id.includes(userID)) {
			await Appointment.deleteOne({ appointment_ID: id });
			res.status(200).json({ status: 'Deleted Successfully' });
		} else {
			throw Error('No permission to delete Appointment');
		}
	} catch (err) {
		handleError(err, res);
	}
};
