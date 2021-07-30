//const serverURL = 'http://localhost:3720/';
//const serverURL = 'https://samy.reversedstudios.com/';
const serverURL = "https://dealsale.de/";

const postFetchData = async (data, url) => {
  const response = await fetch(`${serverURL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("jwt"),
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 200) {
    throw Error("Failed to Fetch");
  }
  return response.json();
};

const getFetchData = async (url) => {
  const response = await fetch(`${serverURL}${url}`, {
    method: "GET",
  });

  if (response.status !== 200) {
    throw Error("Failed to Fetch");
  }
  return response.json();
};

const delFetchData = async (url) => {
  const response = await fetch(`${serverURL}${url}`, {
    method: "DELETE",
  });

  if (response.status !== 200) {
    throw Error("Failed to Fetch");
  }
  return response.json();
};

const multiPartFetch = async (data, url) => {
  const options = {
    method: "POST",
    body: data,
  };

  const res = await fetch(`${serverURL}${url}`, options);

  if (res.status !== 200) {
    throw Error("Failed to Fetch");
  }
  return res.json();
};
