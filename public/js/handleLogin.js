const form = document.querySelector('.lgForm');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const email = form.elements['email'].value;
	const password = form.elements['password'].value;

	const dataObj = {
		email,
		password,
	};

	postFetchData(dataObj, 'login').then((data) => {
		console.log(data);

		if (!data.error) {
			window.location.href = '/deal/create';
		} else {
			document.querySelector('#loginBtn').value = 'Fehler: Email oder Passwort nicht gefunden';
		}
		//window.location.href = '/deal/create';
	});
});
