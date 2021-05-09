const convertTimeToDays = (date) => {
	const year = date.getFullYear() * 365;

	console.log('date: ' + date);

	var day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

	console.log('day: ' + day);
	console.log('year: ' + year);

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

	const hours = Math.floor(timeInHours);
	var minutes = timeInHours - Math.floor(timeInHours);
	minutes = minutes * 60;

	if (minutes === 0) {
		minutes = '00';
	}

	const timeString = `${hours}.${minutes}`;

	return timeString;
};

const convertToMinutes = (time) => {
	const times = time.split(':');

	const hInMin = parseInt(times[0]) * 60;
	console.log('hInMin: ' + hInMin);

	const timeInMin = hInMin + parseInt(times[1]);
	console.log('timeInMin: ' + timeInMin);

	return timeInMin;
};
