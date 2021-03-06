const dealWrapper = document.querySelector('.result-wrapper');
const searchBar = document.querySelector('.dealsearchbar');
const searchForm = document.querySelector('#search_form');
const catWrapper = document.querySelector('.cat-wrapper');
const mobileCatWrapper = document.querySelector('.mobile-cat-wrapper');
const selectCompany = document.querySelector('#company');
const loadMore = document.getElementById('loadMoreBtn');

let counter = 32;
let cat = false;

const renderDeals = (dealsArray) => {
	dealWrapper.innerHTML = '';

	console.log(dealsArray);

	if (dealsArray.status === undefined || dealsArray.status.length === 0) {
		dealWrapper.innerHTML = 'Keine Deals gefunden';
	} else {
		dealsArray.status.map((deal) => {
			//console.log(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100));

			dealWrapper.innerHTML += `
            <div class="result-item-admin" style="max-width: 350px">
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
										alt=""
										class="result_company"
									/>
									<div class="result-meta">
										<div class="likebtncon">
											<h5 class="likeamount">${deal.likes}</h5>
											<img src="/images/like.svg" loading="lazy" alt="" class="like_img" data-_id=${deal._id}/>
										</div>
										<div class="likebtncon">
											<h5 class="likeamount">${deal.dislikes}</h5>
											<img src="/images/dislike.svg" loading="lazy" alt="" class="dislike_img" data-_id=${deal._id}/>
										</div>
									</div>
								</div>
								<div class="div-block-8">
									<h3 class="deal-price">${deal.price} ???</h3>
									<div class="div-block-9">
										<h4 class="oldprice">${deal.oldPrice} ???</h4>
										<h4 class="percentcalc">(-${Math.round(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100))}%)</h4>
									</div>
									<div class="deletedealbtn" data-_id=${deal._id}>
										<h4 class="heading-8">L??schen</h4>
									</div>
									<div class="editbtn" data-_id=${deal._id}>
										<h4 class="heading-8">Bearbeiten</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="div-block-13">
						<div class="result-meta">
							<div class="likebtncon">
								<h5 class="likeamount">1</h5>
								<img src="images/like.svg" loading="lazy" alt="" class="like_img" />
							</div>
							<div class="likebtncon">
								<h5 class="likeamount">1</h5>
								<img src="images/dislike.svg" loading="lazy" alt="" class="dislike_img" />
							</div>
						</div>
						<div class="todealbtn mobile">
							<h4 class="heading-8">Zum Deal</h4>
							<div class="div-block-11"></div>
						</div>
					</div>
				</div> `;
		});
	}

	const deletedealbtn = document.getElementsByClassName('deletedealbtn');

	const delBtnArray = Array.from(deletedealbtn);

	delBtnArray.forEach((el) => {
		el.addEventListener('click', (e) => {
			console.log(e.target);
			if (e.target?.className === 'deletedealbtn') {
				postFetchData({}, `deal/delete?id=${e.target.dataset._id}`)
					.then(() => {
						window.location.href = '/deal/create';
					})
					.catch((err) => {
						console.log(err);
					});
			}
			if (e.target?.className === 'heading-8') {
				const parent = e.target.parentElement;
				postFetchData({}, `deal/delete?id=${parent.dataset._id}`)
					.then(() => {
						window.location.href = '/deal/create';
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
	});
};

window.onload = () => {
	const now = convertTimeToDays(new Date());
	addCompanySelection();
	searchDeal(undefined, undefined, undefined, now, true, counter).then((deals) => {
		renderDeals(deals);
	});
};

const addCompanySelection = () => {
	searchCompany(undefined).then((companys) => {
		console.log(companys);
		selectCompany.innerHTML = '<option value="">Anbieter Ausw??hlen</option>';

		companys.status.forEach((c) => {
			selectCompany.innerHTML += `
			
				<option value=${c.name}>${c.name}</option>
			
			`;
		});
	});
};

searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const now = convertTimeToDays(new Date());
	let key = searchBar.value;
	if (key === '') {
		key = undefined;
	}

	searchDeal(undefined, undefined, key ? searchBar.value : undefined, key ? undefined : now, true, counter).then(
		(deals) => {
			renderDeals(deals);
		}
	);
});

catWrapper.addEventListener('click', (e) => {
	searchCat(e);
});

mobileCatWrapper.addEventListener('click', (e) => {
	searchCat(e);
});

const searchCat = (e) => {
	if (e.target.className === 'clickhandler') {
		const parent = e.target.parentElement;
		let key = parent.querySelector('h5');
		const now = convertTimeToDays(new Date());

		if (key.textContent === 'Alle') {
			key = undefined;
			cat = false;
		} else {
			cat = key.textContent;
		}

		counter = 32;

		searchDeal(key ? key.textContent : undefined, undefined, undefined, key ? undefined : now, true, counter).then(
			(deals) => {
				renderDeals(deals);
			}
		);
	}
};

/* LoadMore */

//loadMoreBtn

loadMore.addEventListener('click', (e) => {
	e.preventDefault();

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

	console.log('counter:' + counter);

	searchDeal(cat ? cat : undefined, undefined, key ? searchBar.value : undefined, now, undefined, counter).then(
		(deals) => {
			renderDeals(deals);
		}
	);
});
