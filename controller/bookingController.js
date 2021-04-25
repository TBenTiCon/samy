const Appointment = require('../model/Appointment');
const { handleError } = require('../middleware/errorHandler');

module.exports.createAppointment = async (req, res) => {
	const body = req.body;

	//const date = parseISO(body.date);
	const date = body.date;

	const time = Appointment.createTime(date, body.time, body.duration);

	const tutor_ID = req.body.tutor_id;
	console.log('tutorID: ' + tutor_ID);

	await Appointment.create({ tutor_ID, time });

	res.status(200).json({ status: `appointment_created` });
};

module.exports.getAppointments = async (req, res) => {
	const query = req.body.date;
	console.log('searchingDate: ' + query);

	//737780

	const slots = await Appointment.find({ 'time.date': query }).sort({ 'time.time': -1 });

	console.log(slots);

	res.status(200).json({ slots });
};
