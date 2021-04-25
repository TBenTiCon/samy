const Appointment = require('../model/Appointment');
const { handleError } = require('../middleware/errorHandler');

module.exports.createAppointment = async (req, res) => {
	const body = req.body;

	//const date = parseISO(body.date);
	const date = body.date;

	const time = Appointment.createTime(date, body.time, body.duration);

	const tutor_id = req.body.tutor_id;
	console.log('tutorID: ' + tutor_id);

	//get appointments
	const slots = await Appointment.find({ tutor_ID: req.body.tutor_id, 'time.date': time.date }).sort({
		'time.time': -1,
	});

	console.log('checkSlots: ' + slots);

	//serverside check for alreadyBookedSlots
	await slots.forEach((slot) => {
		if (slot.time.time === time.time) {
			throw Error('alreadyBookedExeption');
		} else if (time.time + time.duration >= slot.time.time) {
			throw Error('alreadyBookedExeption');
		}
	});

	await Appointment.create({ tutor_ID: tutor_id, time });

	res.status(200).json({ status: `appointment_created` });
};

module.exports.getAppointments = async (req, res) => {
	const query = req.body.date;
	console.log('searchingDate: ' + query);

	//737780

	const slots = await Appointment.find({ tutor_ID: req.body.tutor_id, 'time.date': query }).sort({ 'time.time': -1 });

	console.log(slots);

	res.status(200).json({ slots });
};
