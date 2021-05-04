const postFetchData = async (data, url) => {
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getCookie('jwt') },
		body: JSON.stringify(data),
	});

	return response.json();
};

const getFetchData = async (url) => {
	await fetch(url, {
		method: 'GET',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getCookie('jwt') },
	});
};

const multiPartFetch = async (data, url) => {
	const options = {
		method: 'POST',
		body: data,
	};

	await fetch(url, options);
};
