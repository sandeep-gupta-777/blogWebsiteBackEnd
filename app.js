const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const appRoutes = require('./routes/app');
const passport = require('passport');
const app = express();
const session = require('express-session');


app.use(express.static(path.join(__dirname, 'public')));//this should come before app.use(require('./session')) as per this article

app.use(require('./session'));;
app.use(passport.initialize());//initialize passport's middlerware function to integrate with express

app.use(passport.session());
/*this hoooks up express session middleware with passport, so that we can write and read from session variable
this is used by serialized and deserialised method of passport*/
require('./auth')(); //initialize/register the auth processes

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);
app.use('/', appRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.render('index');
});

module.exports = app;
