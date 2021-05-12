const form = document.querySelector('#dealForm');
const btn = document.querySelector('.addDealBtn');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(form);

	var selected = new Date(form.date.value);

	var date = convertTimeToDays(selected);
	var time = convertToMinutes(form.time.value);

	formData.set('date', date);
	formData.set('time', time);

	formData.set('down', convertTimeToDays(new Date(form.down.value)));
	formData.set('down_time', convertToMinutes(form.down_time.value));

	for (var pair of formData.entries()) {
		console.log(pair[0] + ', ' + pair[1]);
	}

	multiPartFetch(formData, 'http://localhost:3250/deal/create').then((data) => {
		console.log('success');
		btn.value = 'Deal Erstellt';
	});
});
