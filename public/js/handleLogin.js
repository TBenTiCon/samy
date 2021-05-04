const form = document.querySelector('.lgForm');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const email = form.elements['email'].value;
	const password = form.elements['password'].value;

	const dataObj = {
		email,
		password,
	};

	postFetchData(dataObj, 'http://localhost:3250/login').then(() => {
		window.location.href = '/deal/create';
	});
});
