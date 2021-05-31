const dealWrapper = document.querySelector('.result-wrapper');
const searchBar = document.querySelector('.dealsearchbar');
const searchForm = document.querySelector('#search_form');
const heading4 = document.querySelector('.heading-4');
const catWrapper = document.querySelector('.cat-wrapper');
const mobileCatWrapper = document.querySelector('.mobile-cat-wrapper');
const catNav = document.querySelector('.cat_nav');

let counter = 12;
let cat = false;

let timerArray = [];

const renderDeals = (dealsArray) => {
	dealWrapper.innerHTML = '';

	if (timerArray.length > 0) {
		timerArray.forEach((timer) => {
			timer.stopInterval();
		});

		timerArray = [];
	}

	if (dealsArray.status === undefined || dealsArray.status.length === 0) {
		dealWrapper.innerHTML = 'Keine Deals gefunden';
	} else {
		//console.log(dealsArray);

		dealsArray.status.map((deal) => {
			//console.log(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100));

			let isDownable = false;

			//console.log(convertTimeToDays(new Date()) + '=>' + deal.down);

			if (convertTimeToDays(new Date()) === deal.down) {
				console.log('deal.down:' + deal.down);
				console.log('downable');
				isDownable = true;
			}

			console.log('isDownable: ' + isDownable);

			dealWrapper.innerHTML += `

			<a href="#" class="dealitem w-inline-block"
			><img src="${deal.imgLink}" loading="lazy" object-fit="cover" alt="" class="dealbackground" />
			<div class="img_overlay"></div>
			<div class="countdown-container ${isDownable ? 'show' : 'hidden'}" id="I${deal._id}">
				<h4 class="heading-17 timermin">00</h4>
				<h4 class="heading-17">:</h4>
				<h4 class="heading-17 timersec">00</h4>
				<h4 class="heading-17">:</h4>
				<h4 class="heading-17 timersec">00</h4>
			</div>
			<div class="div-block-12">
				<div class="result-content">
					<div class="div-block-33">
						<div class="div-block-34">
							<h4 class="result_heading">${deal.titel}</h4>
						</div>
					</div>
					<h6 class="result_time">${dayToDate(deal.date)} | ${convertToTime(deal.time)} Uhr</h6>
					<h4 class="codeline">${deal.code ? deal.code : 'Nicht benötigt'}</h4>
				</div>
			</div>
			</a>
`;

			//setTimer

			if (isDownable) {
				console.log('timer for ID: ' + deal._id);
				timerArray.push(new Timer(deal.down_time, deal._id));

				console.log(timerArray);

				//console.log(timer);
				//timer.countDown();
			}
		});

		timerArray.forEach((timer) => {
			timer.countDown();
		});
	}
};

window.onload = () => {
	const now = convertTimeToDays(new Date());
	searchDeal(undefined, undefined, undefined, now).then((deals) => {
		renderDeals(deals);
	});
};

searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const now = convertTimeToDays(new Date());
	let key = searchBar.value;
	if (key === '') {
		key = undefined;
	}

	heading4.innerHTML = `Ergebnisse für <strong>${key ? searchBar.value : 'alle'}</strong>`;

	searchDeal(undefined, undefined, key ? searchBar.value : undefined, now).then((deals) => {
		renderDeals(deals);
	});
});

/* LoadMore */

//loadMoreBtn

const loadMore = () => {
	console.log('clicker');

	let key = false;

	counter += 24;

	const now = convertTimeToDays(new Date());

	if (cat) {
		if (cat === 'Alle') cat === false;
	} else {
		if (key === '') {
			key = searchBar.value;
			key = undefined;
		}
	}

	heading4.innerHTML = `Ergebnisse für <strong>${key ? searchBar.value : 'alle'}</strong>`;

	console.log('counter:' + counter);

	searchDeal(cat ? cat : undefined, undefined, key ? searchBar.value : undefined, now, undefined, counter).then(
		(deals) => {
			renderDeals(deals);
		}
	);
};

$(window).scroll(function () {
	if ($(window).scrollTop() + $(window).height() == $(document).height()) {
		loadMore();
	}
});

const searchCat = (e) => {
	if (e.target.className === 'clickhandler') {
		const parent = e.target.parentElement;
		let key = parent.querySelector('h5');
		const now = convertTimeToDays(new Date());

		heading4.innerHTML = `Ergebnisse für <strong>${key.textContent}</strong>`;

		if (key.textContent === 'Alle') {
			key = undefined;
			cat = false;
		} else {
			cat = key.textContent;
		}

		counter = 9;

		searchDeal(key ? key.textContent : undefined, undefined, undefined, now).then((deals) => {
			renderDeals(deals);
		});
	}
};

mobileCatWrapper.addEventListener('click', (e) => {
	console.log('click!');
	searchCat(e);
});

catNav.addEventListener('click', (e) => {
	searchCat(e);
});
