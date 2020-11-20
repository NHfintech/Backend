var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var breakdownRouter = require('./routes/breakdown');
var eventRouter = require('/routes/event');
var guestRouter = require('./routes/guest');
var organizerRouter  = require('./routes/organizer');
var app = express();

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/breakdown', breakdownRouter);
app.use('/event', eventRouter);
app.use('/guest', guestRouter);
app.use('./organizer', organizerRouter);

module.exports = app;
