var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/router');

var app = express();

app.set("views", path.join(__dirname, "public"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('*', function(req, res, next) {
  //replace localhost:3000 to the ip address:port of your server
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

//enable pre-flight
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));

app.use('/', indexRouter);

module.exports = app;
