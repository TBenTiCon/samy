const form = document.querySelector('#email-form');
const btn = document.querySelector('.create_company.w-button');
const searchForm = document.querySelector('#search_form');
const searchBar = document.querySelector('#companyKey');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(form);

	multiPartFetch(formData, 'company/create').then((data) => {
		if (data.error) {
			btn.value = data.status;
		} else {
			btn.value = 'Anbieter Erstellt';
			window.location.href = '/company/create';
		}
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
		console.log(resultArray);

		resultArray.status.map((company) => {
			//console.log(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100));

			console.log(company.imgLink);

			companyWrapper.innerHTML += `
            <div class="company-item">
					<div class="div-block-12">
						<div class="company-result">
							<div class="div-block-6">
								<div class="div-block-7">
									<img
										src="/${company.imgLink}"
										loading="lazy"
										sizes="(max-width: 479px) 100vw, (max-width: 991px) 127.984375px, 164px"
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
				postFetchData({}, `company/delete?id=${e.target.dataset._id}`);
				window.location.href = '/company/create';
			}
			if (e.target?.className === 'heading-8') {
				const parent = e.target.parentElement;
				postFetchData({}, `company/delete?id=${parent.dataset._id}`);
				window.location.href = '/company/create';
			}
		});
	});
};
