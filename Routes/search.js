const express = require('express');
const Router = express.Router();
const gAuth = require('../middleware/authWare');
const controller = require('../controller/searchController');
const { retrieveTokenInfo } = require('../middleware/authWare');

Router.use(retrieveTokenInfo, (req, res, next) => {
	gAuth.authPath(req, res, next, '*');
});

Router.post('/search/getdates', (req, res) => {
	controller.getMyAppointments(req, res);
});

module.exports = Router;
