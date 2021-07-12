const prevForm = document.querySelector('#dealForm');
const title = document.getElementById('titel');
const subTitle = document.getElementById('subTitle');
const prevTitle = document.querySelector('.prevheading');

console.log('title:' + title);
console.log('subTitle:' + subTitle);

title.addEventListener('keydown', (e) => {
	console.log('eVlaue:' + e.target.value);
	prevTitle.textContent = title.value;
});
