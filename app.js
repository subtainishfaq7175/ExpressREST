var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var games = require('./routes/games'); //routes are defined here
var letsplays = require('./routes/letsplays'); //routes are defined here
var news = require('./routes/news'); //routes are defined here
var walkthrough = require('./routes/walkthroughs'); //routes are defined here

var app = express(); //Create the Express app

//connect to our database
//Ideally you will obtain DB details from a config file
var dbName = 'gameDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//this for localhost
app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");/*
    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers","Content-Type");
*/    next();

});
app.use('/api', games); //This is our route middleware
app.use('/api', letsplays); //This is our route middleware
app.use('/api', news); //This is our route middleware
app.use('/api', walkthrough); //This is our route middleware


module.exports = app;

/*

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
*/
