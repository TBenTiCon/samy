const form = document.querySelector('#email-form');
const btn = document.querySelector('.create_company.w-button');
const searchForm = document.querySelector('#search_form');
const searchBar = document.querySelector('#companyKey');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(form);

	multiPartFetch(formData, 'http://localhost:3250/company/create').then((data) => {
		console.log('success');
		btn.value = 'Anbieter Erstellt';
	});
});

searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	let key = searchBar.value;
	if (key === '') {
		key = undefined;
	}

	searchCompany(key ? searchBar.value : undefined).then((companys) => {
		console.log(companys);
		renderCompanys(companys);
	});
});

window.onload = () => {
	searchCompany(undefined).then((companys) => {
		console.log(companys);
		renderCompanys(companys);
	});
};

const companyWrapper = document.querySelector('.result-wrapper');
const renderCompanys = (resultArray) => {
	companyWrapper.innerHTML = '';

	console.log(resultArray);

	if (resultArray.status === undefined || resultArray.status.length === 0) {
		companyWrapper.innerHTML = 'Keine Anbieter gefunden';
	} else {
		resultArray.status.map((company) => {
			//console.log(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100));

			companyWrapper.innerHTML += `
            <div class="company-item">
					<div class="div-block-12">
						<div class="company-result">
							<div class="div-block-6">
								<div class="div-block-7">
									<img
										src=${company.imgLink}
										loading="lazy"
										sizes="(max-width: 479px) 100vw, (max-width: 991px) 127.984375px, 164px"
										srcset="
											images/DealSale-Logo-p-500.png   500w,
											images/DealSale-Logo-p-800.png   800w,
											images/DealSale-Logo-p-1080.png 1080w,
											images/DealSale-Logo.png        1441w
										"
										alt=""
										class="result_company"
									/>
								</div>
								<div class="div-block-8">
									<h3 class="company_name">${company.name}</h3>
									<div class="deletedealbtn" data-_id=${company._id}>
										<h4 class="heading-8">Löschen</h4>
									</div>
								</div>
							</div>
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
				postFetchData({}, `http://localhost:3250/company/delete?id=${e.target.dataset._id}`);
			}
			if (e.target?.className === 'heading-8') {
				const parent = e.target.parentElement;
				postFetchData({}, `http://localhost:3250/company/delete?id=${parent.dataset._id}`);
			}
		});
	});
};
