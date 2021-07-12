const prevForm = document.querySelector('#dealForm');
const title = document.getElementById('titel');
const subTitle = document.getElementById('subTitle');
const prevTitle = document.querySelector('.prevheading');
const prevSub = document.querySelector('.prevsub');

title.addEventListener('keyup', (e) => {
	prevTitle.textContent = title.value;
});

subTitle.addEventListener('keyup', (e) => {
	prevSub.textContent = subTitle.value;
});
