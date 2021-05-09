const form = document.querySelector('.addForm');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(form);

	var selected = new Date(form.date.value);

	var date = convertTimeToDays(selected);
	console.log(date);

	var time = convertToMinutes(form.time.value);

	formData.set('date', date);
	formData.set('time', time);

	for (var pair of formData.entries()) {
		console.log(pair[0] + ', ' + pair[1]);
	}

	multiPartFetch(formData, 'http://localhost:3250/deal/create').then((data) => {
		console.log('success');
	});
});
