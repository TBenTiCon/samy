const dealWrapper = document.querySelector('.result-wrapper');
const searchBar = document.querySelector('.dealsearchbar');
const searchForm = document.querySelector('#search_form');
const heading4 = document.querySelector('.heading-4');
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

			if (convertTimeToDays(new Date()) <= deal.down) {
				console.log('downable');
				isDownable = true;
			}

			dealWrapper.innerHTML += `
            <div class="result-item">
					<div class="div-block-12">
						<div class="countdown-container ${isDownable ? 'show' : 'hidden'}" id="I${deal._id}">
							<h4 class="heading-17 timermin">00</h4>
							<h4 class="heading-17">:</h4>
							<h4 class="heading-17 timersec">00</h4>
							<h4 class="heading-17">:</h4>
							<h4 class="heading-17 timerSeconds">00</h4>
						</div>
						<img src="https://samy.reversedstudios.com/${deal.imgLink}" loading="lazy" alt="" class="dealimg" />
						<div class="result-content">
							<div>
								<h6 class="result_time">${dayToDate(deal.date)} | ${convertToTime(deal.time)} Uhr</h6>
								<h4 class="result_heading">${deal.titel}</h4>
								<h4 class="subheading">${deal.subTitle}</h4>
								<h4 class="codeline">Gutschein: ${deal.code ? deal.code : 'Nicht benötigt'}</h4>
							</div>
							<div class="div-block-6">
								<div class="div-block-8">
									<h3 class="deal-price">${deal.price.replace('.', ',')}€</h3>
									<div class="div-block-9">
										<h4 class="oldprice">${deal.oldPrice.replace('.', ',')} €</h4>
										<h4 class="percentcalc">(-${Math.round(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100))}%)</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="div-block-13">
						<div class="result-meta" data-interacted="false">
							<div class="div-block-28">
								<div class="html-embed w-embed">
									<div class="fb-share-button" data-afLink=${deal.afLink}></div>
								</div>
								<div class="sharelink" data-afLink=${deal.afLink}></div>
							</div>
							<div class="likebtncon" >
								<h5 class="likeamount">1</h5>
								<img src="images/like.svg" loading="lazy" alt="like button" class="like_img " data-_id="${
									deal._id
								}" data-interacted="false"/>
							</div>
							<div class="likebtncon">
								<h5 class="likeamount">1</h5>
								<img src="images/dislike.svg" loading="lazy" alt="" class="dislike_img" data-_id=${deal._id} data-interacted="false"/>
							</div>
						</div>
						<div class="todealbtn mobile">
							<h4 class="heading-8"><a href=${deal.afLink} style="text-decoration: none; color: white;">Zum Deal</a></h4>
						</div>
					</div>
				</div> `;

			//setTimer

			if (isDownable) {
				console.log('timer for ID: ' + deal._id);
				timerArray.push(new Timer(deal.down_time, deal._id, deal.down));

				console.log(timerArray);

				//console.log(timer);
				//timer.countDown();
			}
		});

		timerArray.forEach((timer) => {
			timer.countDown();
		});
	}

	const shareBtn = document.getElementsByClassName('fb-share-button');
	const shareBtns = Array.from(shareBtn);

	shareBtns.forEach((el) => {
		el.addEventListener('click', (e) => {
			if (e.target?.className === 'fb-share-button') {
				//console.log(e.target.dataset.aflink);

				FB.ui(
					{
						method: 'share',
						href: `${e.target.dataset.aflink}`,
					},
					function (response) {}
				);
			}
		});
	});

	const like_img = document.getElementsByClassName('like_img');
	const likeBtns = Array.from(like_img);

	likeBtns.forEach((el) => {
		el.addEventListener('click', (e) => {
			if (e.target?.className === 'like_img') {
				if (e.target.dataset.interacted === 'false') {
					console.log('like');

					if (e.target.parentElement.parentElement.dataset.interacted === 'false') {
						console.log('like2');

						console.log(e.target);
						postFetchData({}, `deal/like?id=${e.target.dataset._id}`);

						const likeDisplay = e.target.parentElement.querySelector('h5');
						likeDisplay.textContent = parseInt(likeDisplay.textContent) + 1;

						e.target.dataset.interacted = 'true';
						e.target.parentElement.parentElement.dataset.interacted = 'true';
					}
				}
			}
		});
	});

	const dislike_img = document.getElementsByClassName('dislike_img');
	const dislikeBtns = Array.from(dislike_img);

	dislikeBtns.forEach((el) => {
		el.addEventListener('click', (e) => {
			if (e.target.dataset.interacted === 'false') {
				if (e.target.parentElement.parentElement.dataset.interacted === 'false') {
					console.log(e.target);
					postFetchData({}, `deal/dislike?id=${e.target.dataset._id}`);

					const likeDisplay = e.target.parentElement.querySelector('h5');
					likeDisplay.textContent = parseInt(likeDisplay.textContent) + 1;

					e.target.dataset.interacted = 'true';
					e.target.parentElement.parentElement.dataset.interacted = 'true';
				}
			}
		});
	});

	const linkButtons = document.getElementsByClassName('sharelink');
	const linkBtns = Array.from(linkButtons);

	linkBtns.forEach((el) => {
		el.addEventListener('click', (e) => {
			if (e.target?.className === 'sharelink') {
				const text = e.target.dataset.aflink;
				copyToClipboard(text);
				window.alert('Link zur Zwischenablage hinzugefügt');
			}
		});
	});
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
	searchCat(e);
});

catNav.addEventListener('click', (e) => {
	searchCat(e);
});

function copyToClipboard(text) {
	if (window.clipboardData && window.clipboardData.setData) {
		// Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
		return window.clipboardData.setData('Text', text);
	} else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
		var textarea = document.createElement('textarea');
		textarea.textContent = text;
		textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
		document.body.appendChild(textarea);
		textarea.select();
		try {
			return document.execCommand('copy'); // Security exception may be thrown by some browsers.
		} catch (ex) {
			console.warn('Copy to clipboard failed.', ex);
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	}
}

const NavBtn = document.querySelector('.div-block-15');
NavBtn.addEventListener('click', () => {
	console.log('click');
	document.querySelector('.mobile_nav').classList.add('showMenu');
});

const closeNavBtn = document.querySelector('.div-block-14');
closeNavBtn.addEventListener('click', () => {
	console.log('click');
	document.querySelector('.mobile_nav').classList.remove('showMenu');
});
