const express = require('express');
const Router = express.Router();
const gAuth = require('../middleware/authWare');
const controller = require('../controller/dealController');
const { retrieveTokenInfo } = require('../middleware/authWare');
//const uploadController = require('../FileHandler/fileController');
const upload = require('../FileHandler/fileController');

//var multer = require('multer');
//var upload = multer({ dest: 'uploads/' });
Router.get('/deal/get', (req, res) => {
	res.render('deals');
});
Router.post('/deal/get', controller.getDeal);
Router.get('/deal/get/single', controller.singleDeal);
Router.post('/company/get', controller.getCompany);

Router.post('/deal/like', controller.addLike);
Router.post('/deal/dislike', controller.addDislike);

Router.use(retrieveTokenInfo, (req, res, next) => {
	gAuth.authPath(req, res, next, '*');
});

Router.get('/company/create', (req, res) => {
	res.render('create');
});

Router.post('/company/create', upload.single('img'), controller.createCompany);
Router.post('/company/delete', controller.delCompany);

Router.get('/deal/create', (req, res) => {
	/* res.setHeader('Content-Security-Policy', "script-src 'self' https://apis.google.com"); */
	res.render('list');
});

Router.post('/deal/create', upload.single('img'), controller.createDeal);
Router.post('/deal/delete', controller.delDeal);

module.exports = Router;
