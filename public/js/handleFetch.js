const postFetchData = async (data, url) => {
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getCookie('jwt') },
		body: JSON.stringify(data),
	});

	return response.json();
};

const postFB = async (data, url) => {
	const response = await fetch(url, {
		method: 'POST',
	});

	return response.json();
};

const getFetchData = async (url) => {
	await fetch(url, {
		method: 'GET',
	});
};

const getFB = async (url) => {
	const response = await fetch(url, {
		method: 'GET',
	});

	return response.json();
};

const multiPartFetch = async (data, url) => {
	const options = {
		method: 'POST',
		body: data,
	};

	const res = await fetch(url, options);

	return res.json();
};
