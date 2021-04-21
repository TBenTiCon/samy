const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

const dbURI = 'mongodb+srv://dbUser:KimpAYUi1C1TrEYG@cluster0.tmypd.mongodb.net/main?retryWrites=true&w=majority';

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3000);
		console.log('listening on port 3000 with db connected');
	})
	.catch((err) => {
		console.log(err);
	});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());

app.use(express.static('public'));

app.use(morgan('dev'));

const cRouter = require('./Routes/auth');
app.use(cRouter);

const pSettings = require('./Routes/pSettings');
app.use(pSettings);
