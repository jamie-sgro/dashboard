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

// IP's allowed all access this server
let whitelist = ["localhost:3000",
  "https://sdsn.localtunnel.me",
  "https://dashboard.localtunnel.me"];

let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
      //callback(new Error('Not allowed by CORS'));
    }
  }
};

// Cross-Origin Resource Sharing
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));

app.use('/', indexRouter);

module.exports = app;
