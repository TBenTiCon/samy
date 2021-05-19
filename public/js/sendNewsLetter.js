const form = document.querySelector('#email-form');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	postFetchData({}, `https://localhost:3720/sendMails`).then((data) => {
		console.log(data);

		if (!data.error) {
			document.querySelector('#sendNewsBtn').value = 'Newsletter versended';
		} else {
			document.querySelector('#sendNewsBtn').value = 'Versenden Fehlgeschlagen';
		}
	});
});
