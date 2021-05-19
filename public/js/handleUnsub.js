const form = document.querySelector('#email-form');
const input = document.querySelector('#Email');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	delFetchData(`https://localhost:3720/subscribe?email=${input.value}`).then((data) => {
		console.log(data);

		if (!data.error) {
			document.querySelector('#unsubBtn').value = 'Email Entfernt';
		}
		//window.location.href = '/deal/create';
	});
});
