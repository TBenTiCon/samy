document.getElementById('doLogOut').addEventListener('click', () => {
	setCookie('jwt', '', 0);
	window.location.href = '/';
});
