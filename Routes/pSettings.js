const express = require('express');
const Router = express.Router();
const gAuth = require('../middleware/authWare');
const controller = require('../controller/settingsController');
const { retrieveTokenInfo } = require('../middleware/authWare');

Router.use(retrieveTokenInfo, (req, res, next) => {
	gAuth.authPath(req, res, next, '*');
});

Router.post('/user/settings', controller.getSettingsInfo_post);
Router.post('/user/settings/pchange', controller.changeProfileInfo_post);

module.exports = Router;
