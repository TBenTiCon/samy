//const serverURL = 'https://localhost:3720/';
const serverURL = 'https://samy.reversedstudios.com/';

const postFetchData = async (data, url) => {
	const response = await fetch(`${serverURL}${url}`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getCookie('jwt') },
		body: JSON.stringify(data),
	});

	return response.json();
};

const getFetchData = async (url) => {
	await fetch(`${serverURL}${url}`, {
		method: 'GET',
	});
};

const delFetchData = async (url) => {
	const response = await fetch(`${serverURL}${url}`, {
		method: 'DELETE',
	});

	return response.json();
};

const multiPartFetch = async (data, url) => {
	const options = {
		method: 'POST',
		body: data,
	};

	const res = await fetch(`${serverURL}${url}`, options);

	return res.json();
};
