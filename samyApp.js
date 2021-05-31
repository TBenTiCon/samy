const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
var cors = require('cors');
const { expressCspHeader, INLINE, NONE, SELF, EVAL } = require('express-csp-header');

const app = express();

var whitelist = ['http://localhost:3722', 'http://localhost:3720', 'http://localhost:3720/'];

/* var corsOptions = {
	origin: 'http://localhost:3722',
	optionsSuccessStatus: 200,
	credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); */

app.use(cookieParser());

app.disable('etag');

const fs = require('fs');
/* const key = fs.readFileSync('./ssl/localhost.key');
const cert = fs.readFileSync('./ssl/localhost.crt'); */

//app.use(express.static('public'));

app.use('/', express.static(__dirname + '/public'));
app.use('/deal', express.static(__dirname + '/public'));
app.use('/company', express.static(__dirname + '/public'));

app.listen(3722);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());

app.use(express.static('public'));

//init viewEngine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(morgan('dev'));

app.use(
	expressCspHeader({
		directives: {
			'default-src': [SELF, '*'],
			'script-src': [SELF, INLINE, EVAL, '*'],
			'style-src': [SELF, INLINE, '*'],
			'font-src': [SELF, 'data:'],
			'img-src': ['data:', '*'],
			'worker-src': [NONE],
			'frame-src': ['*'],
			'block-all-mixed-content': true,
		},
	})
);

const baseRouter = require('./Routes/base');
app.use('/', baseRouter);

app.post('*', (req, res) => {
	console.log('404!!!!');
	res.status(404).json({ status: '404' });
});
