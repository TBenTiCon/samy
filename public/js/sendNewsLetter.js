const form = document.querySelector('#email-form');
const testBtn = document.querySelector('#sendTestNwsBtn');
let number = 0;

form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (number >= 16) {
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

testBtn.addEventListener('click', (e) => {
	if (number >= 16) {
		postFetchData({}, `testMails`).then((data) => {
			console.log(data);

			if (!data.error) {
				document.querySelector('#testBtn').value = 'Newsletter versended';
			} else {
				document.querySelector('#testBtn').value = 'Versenden Fehlgeschlagen';
			}
		});
	} else {
		document.querySelector('#testBtn').value = '16 Deals benötigt';
	}
});

window.onload = async () => {
	const res = await getFetchData('newsletter/amount');

	console.log(res);

	document.querySelector('#dealAmount').textContent = `${res} / 16 Deals`;

	number = res;
};
