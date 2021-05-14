const form = document.querySelector('#dealForm');
const btn = document.querySelector('#addDealBtn');
let access_token = '';

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(form);

	var selected = new Date(form.date.value);

	var date = convertTimeToDays(selected);
	var time = convertToMinutes(form.time.value);

	formData.set('date', date);
	formData.set('time', time);

	formData.set('access_token', access_token);

	formData.set('down', convertTimeToDays(new Date(form.down.value)));
	formData.set('down_time', convertToMinutes(form.down_time.value));

	for (var pair of formData.entries()) {
		console.log(pair[0] + ', ' + pair[1]);
	}

	multiPartFetch(formData, 'https://localhost:3250/deal/create')
		.then((data) => {
			console.log('success');
			btn.value = 'Deal Erstellt';
		})
		.catch((err) => {
			console.log(err);
		});
});

function checkLoginState() {
	FB.getLoginStatus(function (response) {
		if (response.status === 'connected') {
			access_token = response.authResponse.accessToken;

			//handleFBPost();
		}
	});
}

const handleFBPost = async () => {
	const res = await getFB(
		`https://graph.facebook.com/105151565090283?fields=access_token&access_token=${access_token}`
	);

	const data = await res;
	console.log(data);

	const res2 = await fetch(
		`https://graph.facebook.com/105151565090283/feed?message=Hello Fans!&access_token=${data.access_token}`,
		{ method: 'POST' }
	);

	console.log(res2);
};
