const dealContainer = document.querySelector('.dealContainer');

const searchDeal = async (cat, id, key) => {
	let url;

	if (cat) {
		url = `/deal/get?cat=${cat}`;
	} else if (id) {
		url = `/deal/get?id=${id}`;
	} else {
		url = `/deal/get?key=${key}`;
	}

	await postFetchData({}, url).then((data) => {
		console.log('data: ');
		console.log(data);

		data.status.forEach((deal) => {
			dealContainer.innerHTML += `

            <div>
                <h1>${deal.titel}</h1>
                <h2>${deal.subTitle}</h2>
                <img src= "http://localhost:3250/${deal.imgLink}"></img>
            </div>
        `;
		});
	});
};

window.onload = searchDeal(undefined, undefined, 'Otto 23');
