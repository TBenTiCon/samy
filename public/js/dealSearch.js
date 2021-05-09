const dealContainer = document.querySelector('.dealContainer');

const searchDeal = async (cat, id, key, date) => {
	let url;

	if (cat) {
		url = `/deal/get?cat=${cat}`;
	} else if (id) {
		url = `/deal/get?id=${id}`;
	} else if (key) {
		url = `/deal/get?key=${key}`;
	} else if (date) {
		url = `/deal/get?date=${date}`;
	}

	const data = await postFetchData({}, url);

	return data;
};
