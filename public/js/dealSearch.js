const dealContainer = document.querySelector('.dealContainer');

const searchDeal = async (cat, id, key, date, admin) => {
	let url;

	if (cat) {
		url = `deal/get?categorie=${cat}&date=${date}`;
	} else if (id) {
		url = `deal/get?id=${id}`;
	} else if (key) {
		url = `deal/get?titel=${key}&date=${date}`;
	} else if (date) {
		url = `deal/get?date=${date}`;
	}

	if (admin) {
		url = `${url}&admin=${admin}`;
		console.log(url);
	}

	const data = await postFetchData({}, url);

	return data;
};

const searchCompany = async (key) => {
	const url = `company/get?name=${key}`;

	const data = await postFetchData({}, url);

	return data;
};
