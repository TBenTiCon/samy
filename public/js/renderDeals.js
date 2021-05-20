const dealWrapper = document.querySelector('.result-wrapper');
const searchBar = document.querySelector('.dealsearchbar');
const searchForm = document.querySelector('#search_form');
const heading4 = document.querySelector('.heading-4');
const catWrapper = document.querySelector('.cat-wrapper');
const mobileCatWrapper = document.querySelector('.mobile-cat-wrapper');
const catNav = document.querySelector('.cat_nav');
const fCatCon = document.querySelector('.footer_cat_con');

let counter = 12;
let cat = false;

const renderDeals = (dealsArray) => {
	dealWrapper.innerHTML = '';

	if (dealsArray.status === undefined || dealsArray.status.length === 0) {
		dealWrapper.innerHTML = 'Keine Deals gefunden';
	} else {
		dealsArray.status.map((deal) => {
			//console.log(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100));

			dealWrapper.innerHTML += `
            <div class="result-item">
					<div class="div-block-12">
						<img src="/${deal.imgLink}" loading="lazy" alt="" class="dealimg" />
						<div class="result-content">
							<div>
								<h6 class="result_time">${dayToDate(deal.date)} | ${convertToTime(deal.time)} Uhr</h6>
								<h4 class="result_heading">${deal.titel}</h4>
								<h4 class="subheading">${deal.subTitle}</h4>
							</div>
							<div class="div-block-6">
								<div class="div-block-7">
									<img
										src=${deal.cLink}
										loading="lazy"
										sizes="(max-width: 479px) 100vw, (max-width: 991px) 128px, 165px"
										srcset="
											images/DealSale-Logo-p-500.png   500w,
											images/DealSale-Logo-p-800.png   800w,
											images/DealSale-Logo-p-1080.png 1080w,
											images/DealSale-Logo.png        1441w
										"
										alt=""
										class="result_company"
									/>
									<div class="result-meta" data-interacted="false">
										<div class="html-embed w-embed">
											<div class="fb-share-button"></div>
										</div>
										<div class="likebtncon">
											<h5 class="likeamount">${deal.likes}</h5>
											<img src="/images/like.svg" loading="lazy" alt="" class="like_img" data-_id="${deal._id}" data-interacted="false"/>
										</div>
										<div class="likebtncon">
											<h5 class="likeamount">${deal.dislikes}</h5>
											<img src="/images/dislike.svg" loading="lazy" alt="" class="dislike_img" data-_id="${
												deal._id
											}" data-interacted="false"/>
										</div>
									</div>
								</div>
								<div class="div-block-8">
									<h3 class="deal-price">${deal.price} €</h3>
									<div class="div-block-9">
										<h4 class="oldprice">${deal.oldPrice} €</h4>
										<h4 class="percentcalc">(-${Math.round(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100))}%)</h4>
									</div>
									<div class="todealbtn">
										<h4 class="heading-8"><a href="${deal.afLink}" style="text-decoration: none; color:white">Zum Deal</a></h4>
										<div class="div-block-11"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="div-block-13">
						<div class="result-meta" data-interacted="false">
							<div class="html-embed w-embed">
								<div class="fb-share-button"></div>
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
							<h4 class="heading-8"><a href=${deal.afLink} style="text-decoration: none">Zum Deal</a></h4>
							<div class="div-block-11"></div>
						</div>
					</div>
				</div> `;
		});
	}

	const shareBtn = document.getElementsByClassName('fb-share-button');
	const shareBtns = Array.from(shareBtn);

	shareBtns.forEach((el) => {
		el.addEventListener('click', (e) => {
			if (e.target?.className === 'fb-share-button') {
				FB.ui(
					{
						method: 'share',
						href: 'https://dealsale.de',
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
					if (e.target.parentElement.parentElement.dataset.interacted === 'false') {
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

document.getElementById('loadMoreBtn').addEventListener('submit', (e) => {
	e.preventDefault();

	console.log('clicker');

	counter += 24;

	const now = convertTimeToDays(new Date());

	if (cat) {
		if (cat === 'Alle') cat === false;
	} else {
		let key = searchBar.value;
		if (key === '') {
			key = undefined;
		}
	}

	heading4.innerHTML = `Ergebnisse für <strong>${key ? searchBar.value : 'alle'}</strong>`;

	searchDeal(cat ? cat : undefined, undefined, key ? searchBar.value : undefined, now, counter).then((deals) => {
		renderDeals(deals);
	});
});

catWrapper.addEventListener('click', (e) => {
	searchCat(e);
});

mobileCatWrapper.addEventListener('click', (e) => {
	searchCat(e);
});

catNav.addEventListener('click', (e) => {
	searchCat(e);
});

fCatCon.addEventListener('click', (e) => {
	if (e.target.className === 'link') {
		let key = e.target.textContent;
		const now = convertTimeToDays(new Date());

		heading4.innerHTML = `Ergebnisse für <strong>${key}</strong>`;

		cat = key;

		searchDeal(key, undefined, undefined, now).then((deals) => {
			renderDeals(deals);
		});
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

		searchDeal(key ? key.textContent : undefined, undefined, undefined, now).then((deals) => {
			renderDeals(deals);
		});
	}
};

const nlInputDesktop = document.getElementById('desktop-newsletter-input');
const nlInputMobile = document.querySelectorAll('#mobile-newsletter-input-3');

const nlBtnDesktop = document.getElementById('nl_btn_desktop');
const nlBtnMobile = document.querySelectorAll('.nlicon');

nlBtnDesktop.addEventListener('click', (e) => {
	addEmail(nlInputDesktop.value);
});

const addEmail = async (email) => {
	const status = document.getElementById('nlStatusDesktop');

	console.log(email);
	const res = await fetch(`subscribe?email=${email}`, { method: 'POST' });

	if (res.status === 200) {
		status.textContent = 'Du wurdest erfolgreich angemeldet';
	} else {
		status.textContent = '';
	}
};
