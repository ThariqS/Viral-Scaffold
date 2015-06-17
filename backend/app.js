var config = require('../config');

var path = require('path');
var express = require('express');
var livereload = require('connect-livereload');

var app = express();

//app.use(livereload({port: config.ports.livereload}));

app.use(express.static(path.resolve('./backend/dist')));

app.all('/*', function(req, res) {
  res.sendFile(path.resolve('./backend/dist/index.html'));
});

/*
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
*/

module.exports = app;
