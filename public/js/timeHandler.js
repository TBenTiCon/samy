const convertTimeToDays = (date) => {
	const year = date.getFullYear() * 365;

	var day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

	const moment = year + day;
	return moment;
};

const dayToDate = (days) => {
	const timeInYears = days / 365;

	const year = Math.floor(timeInYears);

	var day = timeInYears - Math.floor(timeInYears);

	day = day * 365;

	day = Math.round(day);

	const date = new Date(year, 0, 0);
	date.setDate(date.getDate() + day);

	return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

const convertToTime = (time) => {
	const timeInHours = time / 60;

	console.log('time: ' + time);

	console.log('timeInHours: ' + timeInHours);

	const hours = Math.floor(timeInHours);

	console.log('hours: ' + hours);

	var minutes = timeInHours - Math.floor(timeInHours);
	minutes = Math.round((minutes * 60 + Number.EPSILON) * 100) / 100;

	if (minutes === 0) {
		minutes = '00';
	}

	const timeString = `${hours}.${minutes}`;

	return timeString;
};

const convertToMinutes = (time) => {
	console.log(time);

	const times = time.split(':');

	const hInMin = parseInt(times[0]) * 60;

	const timeInMin = hInMin + parseInt(times[1]);

	return timeInMin;
};
