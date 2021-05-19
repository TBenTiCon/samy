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

	multiPartFetch(formData, 'deal/create')
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
	const IGKey = await fetch(
		`https://graph.facebook.com/v10.0/105151565090283?fields=instagram_business_account&access_token=${access_token}`,
		{
			method: 'GET',
		}
	);

	const Key = await IGKey.json();

	const uploadIG = await fetch(
		`https://graph.facebook.com/${Key.instagram_business_account?.id}/media?image_url=https://upload.wikimedia.org/wikipedia/commons/0/0e/Tree_example_VIS.jpg&caption="Hello WorldText"&access_token=${access_token}`,
		{ method: 'POST' }
	);

	const IGPOSTContainer = await uploadIG.json();
	const PostID = await IGPOSTContainer.id;
	console.log(PostID);

	//POST IMG
	const postIG = await fetch(
		`https://graph.facebook.com/${Key.instagram_business_account?.id}/media_publish?creation_id=${PostID}&access_token=${access_token}`,
		{ method: 'POST' }
	);

	console.log(await postIG.json());
};
