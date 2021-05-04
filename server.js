const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
var cors = require('cors');

const app = express();

/* var corsOptions = {
	origin: 'http://localhost:3250',
	optionsSuccessStatus: 200,
	credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); */
app.use(cookieParser());

app.disable('etag');

app.use(express.static('public'));

const dbURI = 'mongodb+srv://dbUser:bfB1bnblRU01CmW2@cluster0.hkj6q.mongodb.net/sjMain?retryWrites=true&w=majority';

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3250);
		console.log('listening on port 3250 with db connected');
	})
	.catch((err) => {
		console.log(err);
	});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());

app.use(express.static('public'));

//init viewEngine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(morgan('dev'));

const cRouter = require('./Routes/auth');
app.use('/', cRouter);

const pSettings = require('./Routes/pSettings');
app.use(pSettings);

const search = require('./Routes/search');
app.use(search);

const dHandler = require('./Routes/dealHandler');
app.use(dHandler);

app.post('*', (req, res) => {
	console.log('404!!!!');
	res.status(404).json({ status: '404' });
});
