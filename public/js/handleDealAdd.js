const form = document.querySelector('#dealForm');
const btn = document.querySelector('#addDealBtn');
let access_token = '';
let id = false;
const resultWrapper = document.querySelector('.result-wrapper');

resultWrapper.addEventListener('click', async (e) => {
	if (e.target?.className === 'editbtn') {
		console.log('editClick');
		id = e.target.dataset._id;

		const data = await getFetchData(`deal/get/single?id=${id}`);

		form.titel.value = data.status.titel;
		form.subTitle.value = data.status.subTitle;
		form.code.value = data.status.code;
		form.price.value = data.status.price;
		form.oldPrice.value = data.status.oldPrice;
		form.afLink.value = data.status.afLink;
		form.categorie.value = data.status.categorie;
	}
	if (e.target?.className === 'heading-8') {
		const parent = e.target.parentElement;
		id = parent.dataset._id;

		const data = await getFetchData(`deal/get/single?id=${id}`);

		form.titel.value = data.status.titel;
		form.subTitle.value = data.status.subTitle;
		form.code.value = data.status.code;
		form.price.value = data.status.price;
		form.oldPrice.value = data.status.oldPrice;
		form.afLink.value = data.status.afLink;
		form.categorie.value = data.status.categorie;
	}
});

const updateDeal = async () => {
	const formData = new FormData(form);

	if (form.date) formData.set('date', convertTimeToDays(new Date(form.date.value)));
	if (form.time) formData.set('time', convertToMinutes(form.time.value));

	if (form.down) formData.set('down', convertTimeToDays(new Date(form.down.value)));
	if (form.down_time) formData.set('down_time', convertToMinutes(form.down_time.value));

	for (var pair of formData.entries()) {
		console.log(pair[0] + ', ' + pair[1]);
	}

	multiPartFetch(formData, `deal/create?id=${id}`)
		.then((data) => {
			console.log('success');
			btn.value = 'Deal Updated';
			id = false;
		})
		.catch((err) => {
			console.log(err);
			btn.value = 'Fehler: Bitte Seite Neuladen';
			id = false;
		});
};

form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (!id) {
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
	} else if (id) {
		updateDeal();
	}
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
