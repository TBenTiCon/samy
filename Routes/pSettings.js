const express = require('express');
const Router = express.Router();
const gAuth = require('../middleware/authWare');
const controller = require('../controller/settingsController');
const { handleError } = require('../middleware/errorHandler');

Router.use(function (req, res, next) {
	gAuth.authGeneral(req, res, next).catch((err) => {
		handleError(err, res);
	});
});

Router.post('/user/settings', controller.getSettingsInfo_post);
Router.post('/user/settings/pchange', controller.changeProfileInfo_post);

module.exports = Router;
