const { permittedCrossDomainPolicies } = require('helmet');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
	tutor_ID: {
		type: String,
		required: [true, 'Failed to attach tutor_ID'],
	},
	time: {
		date: Number,
		time: Number,
		duration: Number,
	},
});

appointmentSchema.statics.createTime = function (date, time, duration) {
	const times = time.split(':');

	const hInMin = parseInt(times[0]) * 60;
	console.log('hInMin: ' + hInMin);

	const timeInMin = hInMin + parseInt(times[1]);
	console.log('timeInMin: ' + timeInMin);

	const timeObj = { date, time: timeInMin, duration };

	return timeObj;
};

const appointmentModel = mongoose.model('appointment', appointmentSchema);

module.exports = appointmentModel;
