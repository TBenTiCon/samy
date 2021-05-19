const form = document.querySelector('#email-form');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	postFetchData({}, `sendMails`).then((data) => {
		console.log(data);

		if (!data.error) {
			document.querySelector('#sendNewsBtn').value = 'Newsletter versended';
		} else {
			document.querySelector('#sendNewsBtn').value = 'Versenden Fehlgeschlagen';
		}
	});
});
