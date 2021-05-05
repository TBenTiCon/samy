const form = document.querySelector('.addForm');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(form);

	var res = form.date.value.split('-');

	var year = parseInt(res[0]) * 365;
	var month = parseInt(res[1]) * 30;
	var day = parseInt(res[2]);

	var date = year + month + day;

	formData.set('date', date);

	for (var pair of formData.entries()) {
		console.log(pair[0] + ', ' + pair[1]);
	}

	multiPartFetch(formData, 'http://localhost:3250/deal/create').then((data) => {
		console.log('success');
	});
});
