const html = `
<div class="result-item">
    <div class="div-block-12">
        <div class="div-block-17">
            <h3 class="counter">9:00</h3>
        </div>
        <img src="images/c349x211-1.png" loading="lazy" alt="" class="dealimg" />
        <div class="result-content">
            <h6 class="result_time">24.04.2021 | 19.43 Uhr</h6>
            <h4 class="result_heading">Tablet-PC Lenovo Tab M10 (10,1 Zoll, HD, WideView, Touch)</h4>
            <h4 class="subheading">2gb Ram | 16gb eMCP, WiFi, Android 10</h4>
            <div class="div-block-6">
                <div class="div-block-7">
                    <img
                        src="images/DealSale-Logo.png"
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
                </div>
                <div class="div-block-8">
                    <h3 class="deal-price">199,90 €</h3>
                    <div class="div-block-9">
                        <h4 class="oldprice">299,90 €</h4>
                        <h4 class="percentcalc">(-22%)</h4>
                    </div>
                    <div class="todealbtn">
                        <h4 class="heading-8">Zum Deal</h4>
                        <div class="div-block-11"></div>
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
</div>

`;

const dealWrapper = document.querySelector('.result-wrapper');

const renderDeals = (dealsArray) => {
	dealWrapper.innerHTML = '';

	console.log(dealsArray);

	dealsArray.status.map((deal) => {
		console.log(deal);

		//console.log(100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100));

		dealWrapper.innerHTML = `
            <div class="result-item">
                <div class="div-block-12">
                    <div class="div-block-17">
                        <h3 class="counter">9:00</h3>
                    </div>
                    <img src="${deal.imgLink}" loading="lazy" alt="" class="dealimg" />
                    <div class="result-content">
                        <h6 class="result_time">${dayToDate(deal.date)} | ${convertToTime(deal.time)} Uhr</h6>
                        <h4 class="result_heading">${deal.titel}</h4>
                        <h4 class="subheading">${deal.subTitle}</h4>
                        <div class="div-block-6">
                            <div class="div-block-7">
                                <img
                                    src="images/DealSale-Logo.png"
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
                            </div>
                            <div class="div-block-8">
                                <h3 class="deal-price">${deal.price} €</h3>
                                <div class="div-block-9">
                                    <h4 class="oldprice">${deal.oldPrice} €</h4>
                                    <h4 class="percentcalc">- ${Math.round(
										100 - parseFloat(deal.price) / (parseFloat(deal.oldPrice) / 100)
									)}%</h4>
                                </div>
                                <div class="todealbtn">
                                    <h4 class="heading-8">Zum Deal</h4>
                                    <div class="div-block-11"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="div-block-13">
                    <div class="result-meta">
                        <div class="likebtncon">
                            <h5 class="likeamount">${deal.likes}</h5>
                            <img src="images/like.svg" loading="lazy" alt="" class="like_img" />
                        </div>
                        <div class="likebtncon">
                            <h5 class="likeamount">${deal.dislikes}</h5>
                            <img src="images/dislike.svg" loading="lazy" alt="" class="dislike_img" />
                        </div>
                    </div>
                    <div class="todealbtn mobile">
                        <h4 class="heading-8">Zum Deal</h4>
                        <div class="div-block-11"></div>
                    </div>
                </div>
            </div>`;
	});
};

window.onload = () => {
	const now = convertTimeToDays(new Date());
	searchDeal(undefined, undefined, undefined, now).then((deals) => {
		console.log(deals);

		renderDeals(deals);
	});
};
