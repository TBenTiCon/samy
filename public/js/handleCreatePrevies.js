const prevForm = document.querySelector('#dealForm');
const title = document.getElementById('titel');
const subTitle = document.getElementById('subTitle');
const prevTitle = document.querySelector('.prevheading');

console.log('title:' + title);
console.log('subTitle:' + subTitle);

title.addEventListener('keyup', (e) => {
	console.log('eValue:' + title.value);
	prevTitle.textContent = title.value;
});
