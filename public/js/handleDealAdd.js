const form = document.querySelector('.addForm');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(form);

	multiPartFetch(formData, 'http://localhost:3250/deal/create').then((data) => {
		console.log('success');
	});
});
