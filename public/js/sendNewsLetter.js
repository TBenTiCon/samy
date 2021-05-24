const form = document.querySelector('#email-form');
let Number = 0;

form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (Number >= 16) {
		postFetchData({}, `sendMails`).then((data) => {
			console.log(data);

			if (!data.error) {
				document.querySelector('#sendNewsBtn').value = 'Newsletter versended';
			} else {
				document.querySelector('#sendNewsBtn').value = 'Versenden Fehlgeschlagen';
			}
		});
	} else {
		document.querySelector('#sendNewsBtn').value = '16 Deals benötigt';
	}
});

window.onload = async () => {
	const res = await getFetchData('newsletter/amount');

	console.log(res);

	document.querySelector('#dealAmount').textContent = `${res} / 16 Deals`;

	number = res;
};
