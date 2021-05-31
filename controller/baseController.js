module.exports.renderLanding = (req, res) => {
	res.status(200).render('index');
};

module.exports.renderCropping = (req, res) => {
	res.status(200).render('imgCrop');
};
